import { ENDPOINTS, publicAuthClient } from "./authClient";
import { clearSession, getRefreshToken, setSession } from "./sessionStore";

let refreshInFlight = null;

const persist = (data) => {
  setSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });
  return data;
};

export const register = async ({ email, password, firstName, lastName }) => {
  const { data } = await publicAuthClient.post(ENDPOINTS.register, {
    email,
    password,
    firstName,
    lastName,
  });
  return persist(data);
};

export const login = async ({ email, password }) => {
  const { data } = await publicAuthClient.post(ENDPOINTS.login, { email, password });
  return persist(data);
};

export const refreshTokens = () => {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available"));
  }

  refreshInFlight = publicAuthClient
    .post(ENDPOINTS.refresh, { refreshToken })
    .then(({ data }) => persist(data))
    .catch((error) => {
      clearSession();
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearSession();
    return;
  }

  try {
    await publicAuthClient.post(ENDPOINTS.logout, { refreshToken });
  } catch {
    // backend may already have revoked the token; clear the session regardless
  } finally {
    clearSession();
  }
};
