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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        pb: 4,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <Avatar
            sx={{
              mr: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: 20,
            }}
          >
            💪
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, color: "white" }}
          >
            AEG Fitness
          </Typography>
          <Typography
            variant="body2"
            sx={{ mr: 2, color: "rgba(255, 255, 255, 0.9)" }}
          >
            Welcome, {username}
          </Typography>
          <Button
            variant="outlined"
            onClick={logOut}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.3)",
              textTransform: "none",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
            }}
          >
            Track Your Fitness Journey
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
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
