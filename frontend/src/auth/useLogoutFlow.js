import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export const useLogoutFlow = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return useCallback(async () => {
    await logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
};
