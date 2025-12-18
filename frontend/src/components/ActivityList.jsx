import { Card, CardContent, Grid, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const activityEmojis = {
  RUNNING: '🏃',
  WALKING: '🚶',
  CYCLING: '🚴',
};

const activityColors = {
  RUNNING: { from: '#FF6B6B', to: '#FF8E53' },
  WALKING: { from: '#4ECDC4', to: '#44A08D' },
  CYCLING: { from: '#A8E6CF', to: '#3DDC84' },
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Card
        elevation={8}
        sx={{
          borderRadius: 3,
          background: "white",
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, opacity: 0.5 }}>
          🏋️
        </Typography>
        <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
          No Activities Yet
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Start tracking your fitness journey by adding your first activity
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "white",
        }}
      >
        Your Activities
      </Typography>
      <Grid container spacing={2}>
        {activities.map((activity) => {
          const colors = activityColors[activity.type] || activityColors.RUNNING;
          const emoji = activityEmojis[activity.type] || '🏃';
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={activity.id}>
              <Card
                elevation={8}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                  },
                }}
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                    p: 3,
                    color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h3" sx={{ mr: 1 }}>
                      {emoji}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {activity.type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`${activity.duration} min`}
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={`${activity.caloriesBurned} cal`}
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActivityList;
