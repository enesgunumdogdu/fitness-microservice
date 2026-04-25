const STORAGE_KEY = "auth.session.v1";

let session = null;
const listeners = new Set();

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.accessToken || !parsed?.refreshToken || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeToStorage = (value) => {
  if (value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
};

const notify = () => {
  for (const listener of listeners) listener(session);
};

export const initSessionStore = () => {
  session = readFromStorage();
};

export const getSession = () => session;

export const getAccessToken = () => session?.accessToken ?? null;

export const getRefreshToken = () => session?.refreshToken ?? null;

export const setSession = (next) => {
  session = next
    ? {
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
        user: next.user,
      }
    : null;
  writeToStorage(session);
  notify();
};

export const clearSession = () => setSession(null);

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
