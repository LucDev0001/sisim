// Moderação básica (sem dependências): bloqueia contatos/links (anti-spam e anti-golpe),
// ameaças/ódio explícitos e mantém xingamentos fora do mural público.

const strip = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const leet = (s) =>
  strip(s)
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5$]/g, 's');

const URL_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|br|io|me|app|dev|xyz|co|ly|gg|tv|link)\b)/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_RE = /(?:\+?\d[\s().-]*){9,}/;
const HANDLE_RE = /(^|\s)@\w{3,}/;

const BLOCKED = [
  /\b(vou|vamos|iremos)\s+te\s+(matar|estuprar|espancar)\b/,
  /\bte\s+(mato|estupro|espanco)\b/,
  /\bse\s+mata\b/,
  /\bmate-?se\b/,
  /\bmorra\b/,
  /\bsuicid/,
  /\bpedofil/,
  /\bestupr/,
  /\bnazi/,
];

const PROFANE =
  /\b(porra|caralho|merda|puta|putaria|buceta|viado|arrombad[oa]|fdp|cuzao|foder|vsf|vtnc|otario|idiota|imbecil|babaca)\b/;

/** Valida um texto livre (pergunta, nome, mensagem). */
export function checkText(text, label = 'texto') {
  if (!text) return { ok: true };
  if (URL_RE.test(text) || EMAIL_RE.test(text) || PHONE_RE.test(text) || HANDLE_RE.test(text)) {
    return {
      ok: false,
      error: `Não é permitido colocar links, e-mails, telefones ou @usuário no ${label}.`,
    };
  }
  const n = leet(text);
  if (BLOCKED.some((re) => re.test(n))) {
    return { ok: false, error: `O ${label} contém conteúdo que não é permitido (ameaça, ódio ou violência).` };
  }
  return { ok: true };
}

/** Só entra no mural público se estiver limpo de xingamentos. */
export const isCleanForPublic = (text) => !PROFANE.test(leet(text));
