import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Logout, Menu as MenuIcon } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { Link as RouterLink, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import Footer from "./Footer";

const PRIMARY_LINKS = [
  { to: "/dashboard", label: "Dashboard", authOnly: true },
  { to: "/activities", label: "Activities", authOnly: true },
  { to: "/insights", label: "Insights", authOnly: true },
  { to: "/profile", label: "Profile", authOnly: true },
];

const navLinkSx = ({ isActive }) => ({
  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
  fontWeight: isActive ? 700 : 500,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontSize: "0.85rem",
  px: 2,
  py: 1,
  borderRadius: 2,
  background: isActive ? "rgba(102,126,234,0.15)" : "transparent",
  textDecoration: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#fff",
    background: "rgba(102,126,234,0.1)",
  },
});

const BackgroundOrbs = () => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "50%",
        height: "50%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)",
        filter: "blur(80px)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "50%",
        height: "50%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%)",
        filter: "blur(80px)",
      }}
    />
  </Box>
);

const AppShell = ({ children, maxWidth = "lg", disableContainer = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const firstName = user?.firstName || user?.email?.split("@")[0] || "User";
  const [mobileAnchor, setMobileAnchor] = useState(null);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);
  const goToRegister = useCallback(() => navigate("/register"), [navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const visibleLinks = PRIMARY_LINKS.filter((link) => !link.authOnly || isAuthenticated);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0a0a",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackgroundOrbs />
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(20,20,20,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ py: 0.5, gap: 2 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Avatar
              sx={{
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                fontSize: 22,
                width: 42,
                height: 42,
                boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
              }}
            >
              💪
            </Avatar>
            <Typography
              variant="h6"
              className="gradient-text"
              sx={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: { xs: "none", sm: "block" },
              }}
            >
              AEG Fitness
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              ml: 4,
            }}
          >
            {visibleLinks.map((link) => (
              <Box key={link.to} component={NavLink} to={link.to} sx={navLinkSx} end>
                {link.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }} />

          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(event) => setMobileAnchor(event.currentTarget)}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileAnchor}
              open={Boolean(mobileAnchor)}
              onClose={() => setMobileAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  sx: {
                    background: "rgba(20,20,20,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    minWidth: 180,
                  },
                },
              }}
            >
              {visibleLinks.map((link) => (
                <MenuItem
                  key={link.to}
                  selected={location.pathname.startsWith(link.to)}
                  onClick={() => {
                    setMobileAnchor(null);
                    navigate(link.to);
                  }}
                  sx={{ color: "white", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
                >
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {isAuthenticated ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                  display: { xs: "none", lg: "block" },
                }}
              >
                Welcome, {firstName}
              </Typography>
              <Tooltip title="Sign out">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    border: "1px solid rgba(102,126,234,0.4)",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#667eea",
                      background: "rgba(102,126,234,0.1)",
                    },
                  }}
                >
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="text"
                onClick={goToLogin}
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={goToRegister}
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderRadius: 2,
                  background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                  boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg,#5568d3 0%,#6a3f8f 100%)",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {disableContainer ? (
          children
        ) : (
          <Container maxWidth={maxWidth} sx={{ py: { xs: 4, md: 6 } }}>
            {children}
          </Container>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default AppShell;
