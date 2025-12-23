import { Box, Button, Card, CardContent, Container, Typography, Avatar } from "@mui/material";
import { useEffect } from "react";
import Footer from "../components/Footer";

const LoginPage = ({ onLogin }) => {
  useEffect(() => {
    document.title = "Login - AEG Fitness";
  }, []);

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "45%",
          height: "45%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          flex: 1,
          py: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.25)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.8) 100%)",
              py: 6,
              px: 4,
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                opacity: 0.1,
                zIndex: 0,
              }}
            />
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 56,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                mb: 3,
                mx: "auto",
                position: "relative",
                zIndex: 1,
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                animation: "glow 3s ease-in-out infinite",
              }}
            >
              💪
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              className="gradient-text"
              sx={{
                fontWeight: 900,
                mb: 1,
                letterSpacing: "1px",
                textTransform: "uppercase",
                position: "relative",
                zIndex: 1,
              }}
            >
              AEG FITNESS
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              Track your journey to a healthier you
            </Typography>
          </Box>

          <CardContent
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.8,
                px: 2,
              }}
            >
              Sign in to access your personalized dashboard, track your activities, and monitor your fitness progress.
            </Typography>

            <Button
              type="button"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              disableElevation={false}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-3px)",
                  "&:before": {
                    left: "100%",
                  },
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              🔐 Sign In
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 4,
                color: "rgba(255, 255, 255, 0.4)",
                fontWeight: 500,
              }}
            >
              Secure authentication powered by OAuth 2.0
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default LoginPage;
