import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

const ActivitiesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    document.title = "Activities - AEG Fitness";
  }, []);

  const handleActivityAdded = useCallback(() => {
    setRefreshTrigger((value) => value + 1);
  }, []);

  return (
    <AppShell>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
        >
          Activities
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 1,
            mb: 1,
            letterSpacing: "-0.5px",
          }}
        >
          Track your{" "}
          <Box component="span" className="gradient-text">
            fitness journey
          </Box>
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
          Log a session and let your AI coach analyse it within seconds.
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
    </AppShell>
  );
};

export default ActivitiesPage;
