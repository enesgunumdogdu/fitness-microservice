import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivity, getActivityRecommendation } from '../services/api';
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
import Footer from './Footer';

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
        
        const activityResponse = await getActivity(id);
        
        let recommendationData = {};
        try {
          const recommendationResponse = await getActivityRecommendation(id);
          recommendationData = recommendationResponse.data;
        } catch (recError) {
          console.log('Recommendation not ready yet:', recError);
        }
        
        const combinedData = {
          ...activityResponse.data,
          ...recommendationData,
        };
        
        const activityType = combinedData.type || 'Activity';
        document.title = `${activityType} Details - AEG Fitness`;
        
        setActivity(combinedData);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  useEffect(() => {
    if (activity && !activity.recommendation) {
      const interval = setInterval(async () => {
        try {
          const recommendationResponse = await getActivityRecommendation(id);
          if (recommendationResponse.data.recommendation) {
            setActivity(prev => ({
              ...prev,
              ...recommendationResponse.data,
            }));
          }
        } catch (error) {
          console.log('Recommendation still not ready');
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activity, id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
        }}
      >
        <CircularProgress sx={{ color: "#667eea" }} size={60} thickness={4} />
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
          background: "#0a0a0a",
        }}
      >
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
          Activity not found
        </Typography>
      </Box>
    );
  }

  const activityType = activity.type || activity.activityType || 'RUNNING';
  const duration = activity.duration || 0;
  const calories = activity.caloriesBurned || 0;
  const createdAt = activity.createdAt || new Date().toISOString();
  
  const colors = activityColors[activityType] || activityColors.RUNNING;
  const emoji = activityEmojis[activityType] || '🏃';

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        position: "relative",
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
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, flex: 1, py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/activities')}
          sx={{
            mb: 3,
            color: "white",
            borderColor: "rgba(102, 126, 234, 0.4)",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.5px",
            px: { xs: 2, sm: 3 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            "&:hover": {
              borderColor: "#667eea",
              background: "rgba(102, 126, 234, 0.1)",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
            },
          }}
        >
          ← Back to Activities
        </Button>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            background: "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
              p: { xs: 3, sm: 4, md: 5 },
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: { xs: "120px", sm: "150px", md: "200px" },
                height: { xs: "120px", sm: "150px", md: "200px" },
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                transform: "translate(30%, -30%)",
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3, md: 4 }, position: "relative", zIndex: 1, flexWrap: "wrap", gap: { xs: 1, sm: 2 } }}>
              <Typography variant="h1" sx={{ fontSize: { xs: "3rem", sm: "4rem", md: "5rem" } }}>
                {emoji}
              </Typography>
              <Box sx={{ flex: "1 1 auto", minWidth: { xs: "100%", sm: "auto" }, maxWidth: "100%" }}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, textTransform: "uppercase", letterSpacing: "1px", fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" }, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activityType}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  {new Date(createdAt).toLocaleDateString('en-US', {
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
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <Chip
                label={`${duration} minutes`}
                sx={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                  py: { xs: 2, sm: 2.5, md: 3 },
                  px: 1,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: { xs: "110px", sm: "120px", md: "140px" },
                  "& .MuiChip-label": {
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                  },
                }}
              />
              <Chip
                label={`${calories} calories`}
                sx={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                  py: { xs: 2, sm: 2.5, md: 3 },
                  px: 1,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  minWidth: { xs: "120px", sm: "130px", md: "150px" },
                  "& .MuiChip-label": {
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                  },
                }}
              />
            </Box>
          </Box>
        </Card>

        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            background: "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3, md: 4 }, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                🤖
              </Typography>
              <Typography 
                variant="h4" 
                className="gradient-text-fire"
                sx={{ 
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.125rem" },
                }}
              >
                AI-Powered Insights
              </Typography>
            </Box>

            {!activity.recommendation ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  background: "rgba(255, 193, 7, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <CircularProgress size={50} sx={{ mb: 3, color: "#ffc107" }} thickness={4} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#ffc107", textTransform: "uppercase" }}>
                  Generating AI Recommendations
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 193, 7, 0.8)", lineHeight: 1.8 }}>
                  Our AI is analyzing your activity. This usually takes a few moments.
                  Please refresh the page in a moment to see your personalized insights.
                </Typography>
              </Paper>
            ) : (
              <>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mb: 4,
                    background: "rgba(102, 126, 234, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: "#667eea",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Analysis
                  </Typography>
                  <Typography paragraph sx={{ mb: 0, lineHeight: 2, color: "rgba(255, 255, 255, 0.9)", fontSize: "1rem" }}>
                    {activity.recommendation}
                  </Typography>
                </Paper>

                {activity.improvements && activity.improvements.length > 0 && (
                  <>
                    <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: "#ffc107",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      💡 Areas for Improvement
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {activity.improvements.map((improvement, index) => (
                        <Typography
                          key={index}
                          paragraph
                          sx={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            mb: 2,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.8,
                            fontSize: "1rem",
                          }}
                        >
                          <span style={{ marginRight: 12, color: "#ffc107", fontWeight: "bold" }}>•</span>
                          <span>{improvement}</span>
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}

                {activity.suggestions && activity.suggestions.length > 0 && (
                  <>
                    <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: "#9333ea",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ✨ Suggestions
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {activity.suggestions.map((suggestion, index) => (
                        <Typography
                          key={index}
                          paragraph
                          sx={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            mb: 2,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.8,
                            fontSize: "1rem",
                          }}
                        >
                          <span style={{ marginRight: 12, color: "#9333ea", fontWeight: "bold" }}>•</span>
                          <span>{suggestion}</span>
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}

                {activity.safety && activity.safety.length > 0 && (
                  <>
                    <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: "#f72585",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ⚠️ Safety Guidelines
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {activity.safety.map((safety, index) => (
                        <Typography
                          key={index}
                          paragraph
                          sx={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            mb: 2,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.8,
                            fontSize: "1rem",
                          }}
                        >
                          <span style={{ marginRight: 12, color: "#f72585", fontWeight: "bold" }}>•</span>
                          <span>{safety}</span>
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default ActivityDetail;
