import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityDetail from "./components/ActivityDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivitiesPage from "./pages/ActivitiesPage";

function AppContent() {
  const { token, tokenData, logIn } = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  const isPublicRoute = ["/login", "/register"].includes(location.pathname);

  if (!token && !isPublicRoute) {
    return <LoginPage onLogin={logIn} />;
  }

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/activities" replace /> : <LoginPage onLogin={logIn} />} />
      <Route path="/register" element={token ? <Navigate to="/activities" replace /> : <RegisterPage />} />
      <Route path="/activities" element={token ? <ActivitiesPage /> : <Navigate to="/login" replace />} />
      <Route path="/activities/:id" element={token ? <ActivityDetail /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={token ? "/activities" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App