import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { useAuth } from "./auth/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));
const ActivityDetail = lazy(() => import("./components/ActivityDetail"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const RouteFallback = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
    }}
  >
    <CircularProgress sx={{ color: "#667eea" }} thickness={4} />
  </Box>
);

const AnonymousOnly = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppContent = () => (
  <Suspense fallback={<RouteFallback />}>
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
      <Route
        path="/activities"
        element={
          <PrivateRoute>
            <ActivitiesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/activities/:id"
        element={
          <PrivateRoute>
            <ActivityDetail />
          </PrivateRoute>
        }
      />
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
  </Suspense>
);

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
