import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { useAuth } from "./auth/useAuth";
import ActivityDetail from "./components/ActivityDetail";
import PrivateRoute from "./components/PrivateRoute";
import ActivitiesPage from "./pages/ActivitiesPage";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

const AnonymousOnly = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppContent = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route
      path="/login"
      element={
        <AnonymousOnly>
          <LoginPage />
        </AnonymousOnly>
      }
    />
    <Route
      path="/register"
      element={
        <AnonymousOnly>
          <RegisterPage />
        </AnonymousOnly>
      }
    />
    <Route path="/activities" element={<ActivitiesPage />} />
    <Route path="/activities/:id" element={<ActivityDetail />} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/insights"
      element={
        <PrivateRoute>
          <InsightsPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
