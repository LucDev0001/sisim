// Helpers de localStorage (somente no navegador).
const MINE = 'simsim:mine';
const guestKey = (id) => `simsim:guest:${id}`;

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const loadMine = () => read(MINE, []);

export function saveMine(item) {
  const list = loadMine().filter((q) => q.id !== item.id);
  list.unshift({ createdAt: Date.now(), ...item });
  write(MINE, list.slice(0, 30));
}

export const findMine = (id) => loadMine().find((q) => q.id === id) || null;

export const loadGuest = (id) => read(guestKey(id), null);
export const saveGuest = (id, data) => write(guestKey(id), data);

export const shareUrl = (id) => `${window.location.origin}/q/${id}`;

export const SHARE_TEXT =
  'Tenho uma pergunta secreta pra você 👀 A resposta só aparece se nós dois toparmos. Abre aí:';

export async function nativeShare(url, text = SHARE_TEXT) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Sim Sim', text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export const whatsappLink = (url, text = SHARE_TEXT) =>
  `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
