import { neon } from '@neondatabase/serverless';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { checkText, isCleanForPublic } from '@/lib/moderation';

/**
 * Sim Sim — camada de dados.
 *
 * Regra de ouro de privacidade: a API NUNCA devolve a resposta de ninguém.
 * Só devolve "revelado" quando as DUAS pessoas disseram sim. Qualquer outro
 * caso é "pendente" — idêntico para "ainda não respondeu" e "respondeu não".
 *
 * Em produção usa Postgres (Neon free) via DATABASE_URL.
 * Em desenvolvimento, sem DATABASE_URL, usa memória (some ao reiniciar).
 */

export const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
export const RETENTION_DAYS = 30; // depois de expirar, apagamos de vez
export const REPORTS_TO_REMOVE = 3;
export const LIMITS = { question: 160, message: 200, name: 30, minQuestion: 5 };

const HOUR = 60 * 60 * 1000;
const RATE = {
  create: { limit: 8, windowMs: HOUR },
  answer: { limit: 40, windowMs: HOUR },
  report: { limit: 1, windowMs: TTL_MS }, // 1 denúncia por pessoa por pergunta
};

const sha = (t) => createHash('sha256').update(String(t)).digest('hex');
const newToken = () => randomBytes(24).toString('base64url');
const newId = () => randomBytes(6).toString('base64url');
const ipKey = (ip) => sha(`${process.env.IP_SALT || 'simsim'}:${ip || 'unknown'}`).slice(0, 24);

function safeEq(a, b) {
  if (!a || !b) return false;
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

/* ------------------------------ Adapter: Postgres ----------------------------- */

let client;
let ready;

async function sql() {
  if (!client) client = neon(process.env.DATABASE_URL);
  if (!ready) {
    ready = (async () => {
      await client`
        CREATE TABLE IF NOT EXISTS questions (
          id                text PRIMARY KEY,
          owner_token_hash  text NOT NULL,
          question          text NOT NULL,
          owner_message     text,
          guest_answer      boolean,
          guest_message     text,
          guest_token_hash  text,
          created_at        timestamptz NOT NULL DEFAULT now(),
          expires_at        timestamptz NOT NULL
        )
      `;
      // Migrações idempotentes (bancos criados na primeira versão).
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS from_name text`;
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false`;
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS report_count int NOT NULL DEFAULT 0`;
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Geral'`;
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS views int NOT NULL DEFAULT 0`;
      await client`ALTER TABLE questions ADD COLUMN IF NOT EXISTS likes int NOT NULL DEFAULT 0`;
      await client`CREATE INDEX IF NOT EXISTS questions_public_idx ON questions (created_at DESC) WHERE is_public`;
      await client`
        CREATE TABLE IF NOT EXISTS rate_limits (
          key text PRIMARY KEY,
          window_start timestamptz NOT NULL,
          count int NOT NULL
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS stats (key text PRIMARY KEY, value bigint NOT NULL DEFAULT 0)
      `;
      await client`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id text PRIMARY KEY,
          name text NOT NULL,
          role text,
          xp int NOT NULL,
          emoji text,
          updated_at timestamptz DEFAULT now()
        )
      `;
      await client`
        CREATE TABLE IF NOT EXISTS active_users (
          id text PRIMARY KEY,
          last_seen timestamptz DEFAULT now()
        )
      `;
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  await ready;
  return client;
}

const normalize = (r) => ({
  ...r,
  expires_at: new Date(r.expires_at).getTime(),
  created_at: new Date(r.created_at).getTime(),
});

const pg = {
  async insert(r) {
    const s = await sql();
    await s`
      INSERT INTO questions (id, owner_token_hash, question, owner_message, from_name, is_public, expires_at, category)
      VALUES (${r.id}, ${r.owner_token_hash}, ${r.question}, ${r.owner_message}, ${r.from_name},
              ${r.is_public}, ${new Date(r.expires_at).toISOString()}, ${r.category})
    `;
  },
  async get(id) {
    const s = await sql();
    const rows = await s`SELECT * FROM questions WHERE id = ${id}`;
    return rows[0] ? normalize(rows[0]) : null;
  },
  // Atômico: só grava se ainda não há dono da resposta OU se o token confere.
  async setGuest(id, g) {
    const s = await sql();
    const rows = await s`
      UPDATE questions
         SET guest_answer = ${g.answer},
             guest_message = ${g.message},
             guest_token_hash = ${g.token_hash}
       WHERE id = ${id}
         AND (guest_token_hash IS NULL OR guest_token_hash = ${g.token_hash})
      RETURNING id
    `;
    return rows.length > 0;
  },
  async feed(limit, query = '') {
    const s = await sql();
    let rows;
    if (query) {
      const q = `%${query}%`;
      rows = await s`
        SELECT id, question, category, likes, created_at FROM questions
         WHERE is_public AND report_count < ${REPORTS_TO_REMOVE} AND expires_at > now()
           AND (question ILIKE ${q} OR category ILIKE ${q})
         ORDER BY likes DESC, created_at DESC LIMIT ${limit}
      `;
    } else {
      rows = await s`
        SELECT id, question, category, likes, created_at FROM questions
         WHERE is_public AND report_count < ${REPORTS_TO_REMOVE} AND expires_at > now()
         ORDER BY likes DESC, created_at DESC LIMIT ${limit}
      `;
    }
    return rows.map((r) => ({ id: r.id, question: r.question, category: r.category, likes: r.likes || 0, created_at: new Date(r.created_at).getTime() }));
  },
  async incrementView(id) {
    const s = await sql();
    await s`UPDATE questions SET views = views + 1 WHERE id = ${id}`;
  },
  async incrementLike(id) {
    const s = await sql();
    await s`UPDATE questions SET likes = likes + 1 WHERE id = ${id}`;
  },
  async bump(key) {
    const s = await sql();
    await s`
      INSERT INTO stats (key, value) VALUES (${key}, 1)
      ON CONFLICT (key) DO UPDATE SET value = stats.value + 1
    `;
  },
  async stats() {
    const s = await sql();
    const rows = await s`SELECT key, value FROM stats`;
    const o = Object.fromEntries(rows.map((r) => [r.key, Number(r.value)]));
    return { questions: o.questions || 0, reveals: o.reveals || 0 };
  },
  async hit(key, limit, windowMs) {
    const s = await sql();
    const secs = Math.ceil(windowMs / 1000);
    const rows = await s`
      INSERT INTO rate_limits (key, window_start, count) VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.window_start < now() - (${secs}::int * interval '1 second')
                     THEN 1 ELSE rate_limits.count + 1 END,
        window_start = CASE WHEN rate_limits.window_start < now() - (${secs}::int * interval '1 second')
                            THEN now() ELSE rate_limits.window_start END
      RETURNING count
    `;
    const count = rows[0].count;
    return { ok: count <= limit, count };
  },
  async addReport(id) {
    const s = await sql();
    const rows = await s`
      UPDATE questions SET report_count = report_count + 1 WHERE id = ${id} RETURNING report_count
    `;
    return rows[0]?.report_count ?? 0;
  },
  async purge() {
    const s = await sql();
    await s`DELETE FROM questions WHERE expires_at < now() - (${RETENTION_DAYS}::int * interval '1 day')`;
    await s`DELETE FROM rate_limits WHERE window_start < now() - interval '8 days'`;
  },
  async syncLeaderboard({ id, name, role, xp, emoji }) {
    const s = await sql();
    await s`
      INSERT INTO leaderboard (id, name, role, xp, emoji, updated_at)
      VALUES (${id}, ${name}, ${role}, ${xp}, ${emoji}, now())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        xp = EXCLUDED.xp,
        emoji = EXCLUDED.emoji,
        updated_at = now()
    `;
  },
  async getLeaderboard() {
    const s = await sql();
    const rows = await s`SELECT id, name, role, xp, emoji FROM leaderboard ORDER BY xp DESC LIMIT 50`;
    return rows.map((r) => ({ ...r, xp: Number(r.xp) }));
  },
  async pingOnline(id) {
    const s = await sql();
    // Limpa inativos (mais de 1 minuto) a cada request (num app muito grande, faríamos via cron, mas aqui funciona bem)
    await s`DELETE FROM active_users WHERE last_seen < now() - interval '1 minute'`;
    
    // Atualiza o last_seen deste usuário
    if (id) {
      await s`
        INSERT INTO active_users (id, last_seen) VALUES (${id}, now())
        ON CONFLICT (id) DO UPDATE SET last_seen = now()
      `;
    }
    
    // Retorna a contagem atual
    const rows = await s`SELECT count(*) as total FROM active_users`;
    return Number(rows[0].total) || 1;
  }
};

/* ------------------------------- Adapter: memória ----------------------------- */

const mem = (globalThis.__simsim_mem ??= new Map());
const memStats = (globalThis.__simsim_stats ??= { questions: 0, reveals: 0 });
const memRate = (globalThis.__simsim_rate ??= new Map());
const memLeaderboard = (globalThis.__simsim_leaderboard ??= new Map());
const memOnline = (globalThis.__simsim_online ??= new Map());

const memory = {
  async insert(r) {
    mem.set(r.id, {
      ...r,
      created_at: Date.now(),
      guest_answer: null,
      guest_message: null,
      guest_token_hash: null,
      report_count: 0,
      views: 0,
      likes: 0,
      category: r.category || 'Geral',
    });
  },
  async get(id) {
    return mem.get(id) ?? null;
  },
  async setGuest(id, g) {
    const r = mem.get(id);
    if (!r) return false;
    if (r.guest_token_hash && r.guest_token_hash !== g.token_hash) return false;
    r.guest_answer = g.answer;
    r.guest_message = g.message;
    r.guest_token_hash = g.token_hash;
    return true;
  },
  async feed(limit, query = '') {
    const q = query.toLowerCase();
    return [...mem.values()]
      .filter((r) => r.is_public && r.report_count < REPORTS_TO_REMOVE && r.expires_at > Date.now())
      .filter((r) => !q || r.question.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
      .sort((a, b) => (b.likes || 0) - (a.likes || 0) || b.created_at - a.created_at)
      .slice(0, limit)
      .map((r) => ({ id: r.id, question: r.question, category: r.category, likes: r.likes || 0, created_at: r.created_at }));
  },
  async incrementView(id) {
    const q = mem.get(id);
    if (q) q.views = (q.views || 0) + 1;
  },
  async incrementLike(id) {
    const q = mem.get(id);
    if (q) q.likes = (q.likes || 0) + 1;
  },
  async bump(key) {
    memStats[key] = (memStats[key] || 0) + 1;
  },
  async stats() {
    return { ...memStats };
  },
  async hit(key, limit, windowMs) {
    const now = Date.now();
    const cur = memRate.get(key);
    if (!cur || now - cur.start > windowMs) {
      memRate.set(key, { start: now, count: 1 });
      return { ok: 1 <= limit, count: 1 };
    }
    cur.count += 1;
    return { ok: cur.count <= limit, count: cur.count };
  },
  async addReport(id) {
    const r = mem.get(id);
    if (!r) return 0;
    r.report_count += 1;
    return r.report_count;
  },
  async purge() {},
  async syncLeaderboard(r) {
    memLeaderboard.set(r.id, { ...r, updated_at: Date.now() });
  },
  async getLeaderboard() {
    return [...memLeaderboard.values()]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 50);
  },
  async pingOnline(id) {
    const now = Date.now();
    for (const [k, v] of memOnline.entries()) {
      if (now - v > 60000) memOnline.delete(k); // > 1 min
    }
    if (id) memOnline.set(id, now);
    return Math.max(1, memOnline.size);
  }
};

function store() {
  if (process.env.DATABASE_URL) return pg;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL não configurada.');
  }
  return memory;
}

/* ------------------------------------ Regras ---------------------------------- */

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isExpired = (row) => Date.now() > row.expires_at;
const isRemoved = (row) => row.report_count >= REPORTS_TO_REMOVE;
const TOO_MANY = { error: 'Muitas tentativas. Tente de novo mais tarde.', status: 429 };

async function limited(st, kind, ip, extra = '') {
  const cfg = RATE[kind];
  const r = await st.hit(`${kind}:${ipKey(ip)}${extra}`, cfg.limit, cfg.windowMs);
  return !r.ok;
}

export async function createQuestion({ question, message, fromName, isPublic, ip, category }) {
  const q = clean(question, LIMITS.question);
  const msg = clean(message, LIMITS.message);
  const name = clean(fromName, LIMITS.name);
  const cat = clean(category, 30) || 'Geral';

  if (q.length < LIMITS.minQuestion) {
    return { error: 'Escreva uma pergunta com pelo menos 5 caracteres.', status: 400 };
  }
  for (const [text, label] of [[q, 'texto da pergunta'], [msg, 'texto da mensagem'], [name, 'nome']]) {
    const c = checkText(text, label);
    if (!c.ok) return { error: c.error, status: 400 };
  }

  const st = store();
  if (await limited(st, 'create', ip)) return TOO_MANY;

  const id = newId();
  const ownerToken = newToken();
  await st.insert({
    id,
    owner_token_hash: sha(ownerToken),
    question: q,
    owner_message: msg || null,
    from_name: name || null,
    category: cat,
    // Mural público: opt-in, anônimo (sem nome) e só se estiver limpo.
    is_public: Boolean(isPublic) && isCleanForPublic(q),
    expires_at: Date.now() + TTL_MS,
  });
  await st.bump('questions');
  if (Math.random() < 0.05) st.purge().catch(() => {}); // limpeza oportunista
  return { id, ownerToken };
}

/** Dados públicos — nunca inclui nada sobre respostas. */
export async function getPublic(id) {
  const row = await store().get(id);
  if (!row) return null;
  return {
    id: row.id,
    question: row.question,
    fromName: row.from_name || null,
    expired: isExpired(row),
    removed: isRemoved(row),
  };
}

export async function submitAnswer(id, { answer, message, guestToken, ip }) {
  if (typeof answer !== 'boolean') return { error: 'Resposta inválida.', status: 400 };
  const st = store();
  const row = await st.get(id);
  if (!row) return { error: 'Pergunta não encontrada.', status: 404 };
  if (isRemoved(row)) return { error: 'Essa pergunta foi removida.', status: 410 };
  if (isExpired(row)) return { error: 'Essa pergunta expirou.', status: 410 };

  const msg = answer ? clean(message, LIMITS.message) : '';
  const c = checkText(msg, 'texto da mensagem');
  if (!c.ok) return { error: c.error, status: 400 };
  if (await limited(st, 'answer', ip)) return TOO_MANY;

  // Resposta "isca": quem não é o dono da resposta recebe o mesmo retorno neutro
  // de sempre, sem alterar nada e sem revelar que já existe resposta.
  const decoy = { guestToken: newToken(), revealed: false, message: null };

  let token;
  if (row.guest_token_hash) {
    if (!guestToken || !safeEq(sha(guestToken), row.guest_token_hash)) return decoy;
    if (row.guest_answer === true) {
      return { guestToken, revealed: true, message: row.owner_message };
    }
    token = guestToken;
  } else {
    token = newToken();
  }

  const saved = await st.setGuest(id, {
    answer,
    message: msg || null,
    token_hash: sha(token),
  });
  if (!saved) return decoy;

  if (answer) await st.bump('reveals');
  return { guestToken: token, revealed: answer, message: answer ? row.owner_message : null };
}

export async function getResult(id, role, token) {
  const row = await store().get(id);
  if (!row) return { error: 'Pergunta não encontrada.', status: 404 };

  const authorized =
    role === 'owner'
      ? safeEq(sha(token || ''), row.owner_token_hash)
      : role === 'guest'
        ? safeEq(sha(token || ''), row.guest_token_hash)
        : false;
  if (!authorized) return { error: 'Acesso negado.', status: 403 };

  if (isRemoved(row)) return { state: 'removed' };
  if (row.guest_answer === true) {
    return { state: 'revealed', message: role === 'owner' ? row.guest_message : row.owner_message, views: row.views || 0, fromName: row.from_name };
  }
  if (isExpired(row)) return { state: 'expired', views: row.views || 0 };
  return { state: 'pending', views: row.views || 0 };
}

/** Denúncia: 1 por pessoa; ao atingir o limite a pergunta é removida. */
export async function reportQuestion(id, ip) {
  const st = store();
  const row = await st.get(id);
  if (!row) return { error: 'Pergunta não encontrada.', status: 404 };
  const r = await st.hit(`report:${ipKey(ip)}:${id}`, RATE.report.limit, RATE.report.windowMs);
  if (r.ok) await st.addReport(id);
  return { ok: true }; // resposta neutra: não revela se contou
}

/** Mural: perguntas que os próprios autores liberaram, sempre anônimas. */
export async function getFeed(limit = 12, query = '') {
  const rows = await store().feed(limit * 2, query);
  const now = Date.now();
  return rows
    .filter((r) => isCleanForPublic(r.question))
    .slice(0, limit)
    .map((r) => ({ id: r.id, text: r.question, category: r.category, likes: r.likes || 0, ageMs: now - r.created_at }));
}

export async function getStats() {
  return store().stats();
}

export async function syncLeaderboard(data) {
  if (!data.id || !data.name || typeof data.xp !== 'number') return { error: 'Dados inválidos.', status: 400 };
  const cleanName = clean(data.name, LIMITS.name);
  if (cleanName.length < 2) return { error: 'Nome muito curto.', status: 400 };
  const c = checkText(cleanName, 'nome');
  if (!c.ok) return { error: c.error, status: 400 };
  
  await store().syncLeaderboard({
    id: data.id,
    name: cleanName,
    role: clean(data.role, 30) || 'Corajoso',
    xp: data.xp,
    emoji: clean(data.emoji, 5) || '🔥',
  });
  return { ok: true };
}

export async function getLeaderboard() {
  return store().getLeaderboard();
}

export async function pingOnline(id) {
  return store().pingOnline(id);
}

export async function likeQuestion(id) {
  await store().incrementLike(id);
  return { ok: true };
}
