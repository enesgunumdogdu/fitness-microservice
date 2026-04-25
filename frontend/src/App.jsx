import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { useAuth } from "./auth/useAuth";
import ActivityDetail from "./components/ActivityDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivitiesPage from "./pages/ActivitiesPage";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/activities" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/activities" replace /> : <RegisterPage />}
      />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/activities/:id" element={<ActivityDetail />} />
      <Route path="/" element={<Navigate to="/activities" replace />} />
      <Route path="*" element={<Navigate to="/activities" replace />} />
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
