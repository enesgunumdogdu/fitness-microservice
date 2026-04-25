import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextValue";
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "./authService";
import { getSession, initSessionStore, subscribe } from "./sessionStore";

initSessionStore();

export const AuthProvider = ({ children }) => {
  const [session, setSessionState] = useState(getSession);

  useEffect(() => subscribe(setSessionState), []);

  const login = useCallback(async (credentials) => {
    await loginRequest(credentials);
  }, []);

  const register = useCallback(async (payload) => {
    await registerRequest(payload);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
