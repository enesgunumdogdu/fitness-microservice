import axios from "axios";
import { refreshTokens } from "../auth/authService";
import { clearSession, getAccessToken, getSession } from "../auth/sessionStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  const userId = getSession()?.user?.id;

  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (userId) config.headers["X-User-ID"] = userId;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config;

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      await refreshTokens();
    } catch (refreshError) {
      clearSession();
      return Promise.reject(refreshError);
    }

    const newToken = getAccessToken();
    if (newToken) {
      original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
    }

    return api(original);
  }
);

export const getActivities = () => api.get("/activities");
export const addActivity = (activity) => api.post("/activities", activity);
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);
