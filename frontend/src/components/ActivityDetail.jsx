import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Paper,
} from '@mui/material';

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

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        const response = await getActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress sx={{ color: "white" }} size={60} />
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Activity not found
        </Typography>
      </Box>
    );
  }

  const colors = activityColors[activity.type] || activityColors.RUNNING;
  const emoji = activityEmojis[activity.type] || '🏃';

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Button
          variant="outlined"
          onClick={() => navigate('/activities')}
          sx={{
            mb: 3,
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.3)",
            textTransform: "none",
            "&:hover": {
              borderColor: "white",
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          ← Back to Activities
        </Button>

        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
              p: 4,
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography variant="h2" sx={{ mr: 2 }}>
                {emoji}
              </Typography>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {activity.type}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {new Date(activity.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={`${activity.duration} minutes`}
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 2.5,
                }}
              />
              <Chip
                label={`${activity.caloriesBurned} calories`}
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 2.5,
                }}
              />
            </Box>
          </Box>
        </Card>

        {activity.recommendation && (
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="h3" sx={{ mr: 2 }}>
                  🤖
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  AI-Powered Insights
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Analysis
                </Typography>
                <Typography paragraph sx={{ mb: 0, lineHeight: 1.8 }}>
                  {activity.recommendation}
                </Typography>
              </Paper>

              {activity.improvements && activity.improvements.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    💡 Areas for Improvement
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {activity.improvements.map((improvement, index) => (
                      <Typography
                        key={index}
                        paragraph
                        sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                      >
                        <span style={{ marginRight: 8 }}>•</span>
                        <span>{improvement}</span>
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {activity.suggestions && activity.suggestions.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    ✨ Suggestions
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {activity.suggestions.map((suggestion, index) => (
                      <Typography
                        key={index}
                        paragraph
                        sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                      >
                        <span style={{ marginRight: 8 }}>•</span>
                        <span>{suggestion}</span>
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {activity.safety && activity.safety.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    ⚠️ Safety Guidelines
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {activity.safety.map((safety, index) => (
                      <Typography
                        key={index}
                        paragraph
                        sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                      >
                        <span style={{ marginRight: 8 }}>•</span>
                        <span>{safety}</span>
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ActivityDetail;
