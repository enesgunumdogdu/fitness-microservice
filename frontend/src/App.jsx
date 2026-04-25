import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityDetail from "./components/ActivityDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivitiesPage from "./pages/ActivitiesPage";

function AppContent() {
  const { token, tokenData, logIn } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/activities" replace /> : <LoginPage onLogin={logIn} />} />
      <Route path="/register" element={token ? <Navigate to="/activities" replace /> : <RegisterPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/activities/:id" element={<ActivityDetail />} />
      <Route path="/" element={<Navigate to="/activities" replace />} />
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
