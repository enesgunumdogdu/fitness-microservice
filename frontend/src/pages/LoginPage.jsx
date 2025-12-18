import { Box, Button, Card, CardContent, Container, Typography, Avatar } from "@mui/material";
import { useEffect } from "react";

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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35%",
          height: "35%",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
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
          py: 4,
        }}
      >
        <Card
          elevation={24}
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 6,
              px: 4,
              textAlign: "center",
              color: "white",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: 48,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                mb: 2,
                mx: "auto",
              }}
            >
              💪
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                letterSpacing: "-0.5px",
              }}
            >
              AEG Fitness
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
                fontWeight: 300,
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
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "text.secondary",
                lineHeight: 1.6,
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
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            >
              🔐 Sign In
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 3,
                color: "text.secondary",
              }}
            >
              Secure authentication powered by OAuth 2.0
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
