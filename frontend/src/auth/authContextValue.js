import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
