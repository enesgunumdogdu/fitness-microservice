import { Box, Container, Typography, Button, AppBar, Toolbar, Avatar } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

const ActivitiesPage = () => {
  const { logOut, tokenData } = useContext(AuthContext);
  const username = tokenData?.preferred_username || tokenData?.name || "User";
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    document.title = "My Activities - AEG Fitness";
  }, []);

  const handleActivityAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0a0a",
        position: "relative",
        pb: 4,
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            background: "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </Box>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(20, 20, 20, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          <Avatar
            sx={{
              mr: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: 24,
              width: 45,
              height: 45,
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
            }}
          >
            💪
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            className="gradient-text"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            AEG FITNESS
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              mr: 3, 
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
              display: { xs: "none", sm: "block" },
            }}
          >
            Welcome, {username}
          </Typography>
          <Button
            variant="outlined"
            onClick={logOut}
            sx={{
              color: "white",
              borderColor: "rgba(102, 126, 234, 0.4)",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.5px",
              borderRadius: 2,
              px: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#667eea",
                background: "rgba(102, 126, 234, 0.1)",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 6, position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h3"
            className="gradient-text"
            sx={{
              fontWeight: 900,
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Track Your Fitness Journey
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 400,
              letterSpacing: "0.5px",
            }}
          >
            Log your activities and get personalized AI recommendations
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "400px 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <ActivityForm onActivityAdded={handleActivityAdded} />
          </Box>
          <Box>
            <ActivityList key={refreshTrigger} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ActivitiesPage;
