// Gamificação "Coragem": XP, níveis, sequência diária, missão do dia e conquistas.
// Tudo fica no aparelho (localStorage) — sem login. Eventos viram toasts via CustomEvent.

const KEY = 'simsim:game:v1';

export const LEVELS = [
  { min: 0, name: 'Tímido', emoji: '🫣' },
  { min: 40, name: 'Curioso', emoji: '👀' },
  { min: 100, name: 'Corajoso', emoji: '🦁' },
  { min: 200, name: 'Destemido', emoji: '🔥' },
  { min: 350, name: 'Cupido', emoji: '💘' },
  { min: 550, name: 'Mestre do Sim', emoji: '👑' },
  { min: 800, name: 'Lenda do Sim', emoji: '🌟' },
];

export const BADGES = [
  { id: 'first_question', emoji: '🌱', name: 'Primeira Coragem', desc: 'Fez a sua primeira pergunta.', test: (s) => s.created >= 1 },
  { id: 'answerer', emoji: '🗣️', name: 'Sincerão', desc: 'Respondeu uma pergunta secreta.', test: (s) => s.answered >= 1 },
  { id: 'first_reveal', emoji: '🎉', name: 'Duplo Sim', desc: 'Teve o primeiro Sim Sim revelado.', test: (s) => s.reveals >= 1 },
  { id: 'five_questions', emoji: '🎯', name: 'Metralhadora', desc: 'Fez 5 perguntas.', test: (s) => s.created >= 5 },
  { id: 'three_reveals', emoji: '🧲', name: 'Ímã de Sim', desc: '3 Sim Sims revelados.', test: (s) => s.reveals >= 3 },
  { id: 'sharer', emoji: '📣', name: 'Divulgador', desc: 'Compartilhou 3 vezes.', test: (s) => s.shares >= 3 },
  { id: 'streak3', emoji: '🔥', name: 'Fogo Baixo', desc: '3 dias seguidos por aqui.', test: (s) => s.bestStreak >= 3 },
  { id: 'streak7', emoji: '☄️', name: 'Chama Eterna', desc: '7 dias seguidos por aqui.', test: (s) => s.bestStreak >= 7 },
  { id: 'level4', emoji: '💘', name: 'Cupido', desc: 'Chegou ao nível Cupido.', test: (s) => s.xp >= LEVELS[4].min },
];

const XP = { create: 20, answer: 10, reveal: 60, share: 5, quest: 15, badge: 25 };
const SHARE_DAILY_CAP = 3;

const fresh = () => ({
  id: Math.random().toString(36).slice(2, 10),
  rankingName: '',
  xp: 0,
  created: 0,
  answered: 0,
  reveals: 0,
  shares: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: null,
  questDay: null,
  shareDay: null,
  shareToday: 0,
  revealIds: [],
  badges: {},
});

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const yesterday = () => {
  const d = new Date(Date.now() - 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function getState() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const state = { ...fresh(), ...parsed };
    if (!state.id) state.id = Math.random().toString(36).slice(2, 10);
    return state;
  } catch {
    return fresh();
  }
}

export function setRankingName(name) {
  const s = getState();
  s.rankingName = name;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  emit('simsim:game', s);
  return s;
}

export function levelInfo(xp) {
  let i = 0;
  LEVELS.forEach((l, idx) => {
    if (xp >= l.min) i = idx;
  });
  const cur = LEVELS[i];
  const next = LEVELS[i + 1] || null;
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { index: i, level: i + 1, ...cur, next, progress, toNext: next ? next.min - xp : 0 };
}

const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

/**
 * Registra um evento de jogo. Retorna o novo estado.
 * Eventos: visit | create | answer | reveal (payload.id) | share
 */
export function award(event, payload = {}) {
  if (typeof window === 'undefined') return null;
  const s = getState();
  const before = levelInfo(s.xp).index;
  const notes = [];
  const gain = (amount, label) => {
    s.xp += amount;
    notes.push({ type: 'xp', amount, label });
  };

  if (event === 'visit') {
    const t = today();
    if (s.lastDay !== t) {
      s.streak = s.lastDay === yesterday() ? s.streak + 1 : 1;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      s.lastDay = t;
      const bonus = 5 + 2 * Math.min(s.streak - 1, 5);
      gain(bonus, s.streak > 1 ? `Sequência de ${s.streak} dias 🔥` : 'Bem-vindo de volta');
    }
  }

  if (event === 'create') {
    s.created += 1;
    gain(XP.create, 'Pergunta criada');
  }
  if (event === 'answer') {
    s.answered += 1;
    gain(XP.answer, 'Pergunta respondida');
  }
  if (event === 'reveal') {
    const id = payload.id;
    if (id && !s.revealIds.includes(id)) {
      s.revealIds = [id, ...s.revealIds].slice(0, 200);
      s.reveals += 1;
      gain(XP.reveal, 'SIM SIM revelado! 🎉');
    }
  }
  if (event === 'share') {
    const t = today();
    if (s.shareDay !== t) {
      s.shareDay = t;
      s.shareToday = 0;
    }
    s.shares += 1;
    if (s.shareToday < SHARE_DAILY_CAP) {
      s.shareToday += 1;
      gain(XP.share, 'Link compartilhado');
    }
  }

  // Missão do dia: fazer ou responder 1 pergunta.
  if ((event === 'create' || event === 'answer') && s.questDay !== today()) {
    s.questDay = today();
    gain(XP.quest, 'Missão do dia concluída ✅');
  }

  // Conquistas (podem render XP extra).
  for (const b of BADGES) {
    if (!s.badges[b.id] && b.test(s)) {
      s.badges[b.id] = Date.now();
      s.xp += XP.badge;
      notes.push({ type: 'badge', badge: { id: b.id, emoji: b.emoji, name: b.name, desc: b.desc }, amount: XP.badge });
    }
  }

  const after = levelInfo(s.xp);
  if (after.index > before) notes.push({ type: 'level', level: after.level, name: after.name, emoji: after.emoji });

  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  if (notes.length) notes.forEach((n) => emit('simsim:toast', n));
  emit('simsim:game', s);
  return s;
}

export const questDone = (s) => s.questDay === today();
