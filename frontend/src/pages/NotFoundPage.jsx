import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../auth/useAuth";
import AppShell from "../components/AppShell";
import { usePageTitle } from "../hooks/usePageTitle";

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  usePageTitle("Not Found - AEG Fitness");

  const secondary = isAuthenticated
    ? { label: "Go to dashboard", to: "/dashboard" }
    : { label: "Sign in", to: "/login" };

  return (
    <AppShell maxWidth="md">
      <Box sx={{ textAlign: "center", py: { xs: 6, md: 12 } }}>
        <Typography
          className="gradient-text"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "6rem", md: "10rem" },
            lineHeight: 1,
            letterSpacing: "-4px",
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 2, mb: 2, letterSpacing: "-0.5px" }}>
          We couldn&apos;t find that page.
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 460, mx: "auto", mb: 5 }}>
          The link may be broken or the page may have moved.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Home />}
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg,#5568d3 0%,#6a3f8f 100%)",
              },
            }}
          >
            Go home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={RouterLink}
            to={secondary.to}
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "white",
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                borderColor: "#667eea",
                background: "rgba(102,126,234,0.08)",
              },
            }}
          >
            {secondary.label}
          </Button>
        </Stack>
      </Box>
    </AppShell>
  );
};

export default NotFoundPage;
