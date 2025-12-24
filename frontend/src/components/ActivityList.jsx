import { Card, CardContent, Grid, Typography, Box, Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';
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
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      const sorted = sortActivities(response.data, sortNewestFirst);
      setActivities(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortActivities = (data, newestFirst) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleSort = () => {
    setSortNewestFirst(!sortNewestFirst);
    setActivities(prevActivities => sortActivities(prevActivities, !sortNewestFirst));
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
        <CircularProgress sx={{ color: "#667eea" }} size={60} thickness={4} />
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: "rgba(20, 20, 20, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          textAlign: "center",
          py: 10,
        }}
      >
        <Typography variant="h2" sx={{ mb: 3, fontSize: "4rem" }}>
          🏋️
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "#ffffff", fontWeight: 700 }}>
          No Activities Yet
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Start tracking your fitness journey by adding your first activity
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography
          variant="h5"
          className="gradient-text"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Your Activities
        </Typography>
        <Tooltip title={sortNewestFirst ? "Newest First" : "Oldest First"}>
          <IconButton
            onClick={toggleSort}
            sx={{
              background: "rgba(102, 126, 234, 0.2)",
              color: "white",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              width: 45,
              height: 45,
              "&:hover": {
                background: "rgba(102, 126, 234, 0.3)",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Typography sx={{ fontSize: 24 }}>
              {sortNewestFirst ? "⬇️" : "⬆️"}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        {activities.map((activity) => {
          const colors = activityColors[activity.type] || activityColors.RUNNING;
          const emoji = activityEmojis[activity.type] || '🏃';
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={activity.id} sx={{ display: "flex" }}>
              <Card
                elevation={0}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "rgba(20, 20, 20, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.02)",
                    border: `1px solid ${colors.from}`,
                    boxShadow: `0 20px 40px rgba(102, 126, 234, 0.3), 0 0 40px ${colors.from}33`,
                  },
                }}
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                    p: 3,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100px",
                      height: "100px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                      transform: "translate(30%, -30%)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, position: "relative", zIndex: 1 }}>
                    <Typography variant="h2" sx={{ mr: 1.5, fontSize: "2.5rem", flexShrink: 0 }}>
                      {emoji}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {activity.type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    <Chip
                      label={`${activity.duration} min`}
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        minWidth: "80px",
                        "& .MuiChip-label": {
                          px: 2,
                        },
                      }}
                    />
                    <Chip
                      label={`${activity.caloriesBurned} cal`}
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        minWidth: "95px",
                        "& .MuiChip-label": {
                          px: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5, background: "rgba(10, 10, 10, 0.4)", mt: "auto" }}>
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 500 }}>
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
