import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AppShell from "./AppShell";
import { getActivityMeta } from "../lib/activityMeta";
import { formatActivityDateTime } from "../lib/dates";
import { getActivity, getActivityRecommendation } from "../services/api";

const POLL_INTERVAL_MS = 5000;
const POLL_MAX_ATTEMPTS = 60;

const debugLog = (message, error) => {
  if (import.meta.env.DEV) console.debug(message, error?.message);
};

const ListSection = ({ title, color, items }) => {
  if (!items?.length) return null;
  return (
    <>
      <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ pl: 2 }}>
        {items.map((item, index) => (
          <Typography
            key={index}
            paragraph
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: 2,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.8,
              fontSize: "1rem",
            }}
          >
            <span style={{ marginRight: 12, color, fontWeight: "bold" }}>•</span>
            <span>{item}</span>
          </Typography>
        ))}
      </Box>
    </>
  );
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        const activityResponse = await getActivity(id);

        let recommendationData = {};
        try {
          const recommendationResponse = await getActivityRecommendation(id);
          recommendationData = recommendationResponse.data;
        } catch (recError) {
          debugLog("Recommendation not ready yet:", recError);
        }

        const combinedData = {
          ...activityResponse.data,
          ...recommendationData,
        };

        const activityType = combinedData.type || "Activity";
        document.title = `${activityType} Details - AEG Fitness`;

        if (!cancelled) setActivity(combinedData);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchActivityDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!activity || activity.recommendation) return undefined;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      if (attempts > POLL_MAX_ATTEMPTS) {
        clearInterval(interval);
        return;
      }
      try {
        const recommendationResponse = await getActivityRecommendation(id);
        if (!recommendationResponse.data?.recommendation) return;
        clearInterval(interval);
        setActivity((prev) => ({
          ...prev,
          ...recommendationResponse.data,
        }));
      } catch (error) {
        debugLog("Recommendation still not ready", error);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activity, id]);

  if (loading) {
    return (
      <AppShell maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#667eea" }} size={60} thickness={4} />
        </Box>
      </AppShell>
    );
  }

  if (!activity) {
    return (
      <AppShell maxWidth="md">
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Activity not found
          </Typography>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/activities")}>
            Back to activities
          </Button>
        </Box>
      </AppShell>
    );
  }

  const activityType = activity.type || activity.activityType || "RUNNING";
  const duration = activity.duration || 0;
  const calories = activity.caloriesBurned || 0;
  const createdAt = activity.createdAt || new Date().toISOString();
  const meta = getActivityMeta(activityType);

  return (
    <AppShell maxWidth="md">
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate("/activities")}
        sx={{
          mb: 3,
          color: "white",
          borderColor: "rgba(102,126,234,0.4)",
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "0.5px",
          "&:hover": {
            borderColor: "#667eea",
            background: "rgba(102,126,234,0.1)",
            boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
          },
        }}
      >
        Back to activities
      </Button>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          mb: 4,
          background: "rgba(20,20,20,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${meta.from} 0%, ${meta.to} 100%)`,
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
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, sm: 3, md: 4 },
              position: "relative",
              zIndex: 1,
              flexWrap: "wrap",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Typography variant="h1" sx={{ fontSize: { xs: "3rem", sm: "4rem", md: "5rem" } }}>
              {meta.emoji}
            </Typography>
            <Box sx={{ flex: "1 1 auto", minWidth: { xs: "100%", sm: "auto" }, maxWidth: "100%" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activityType}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                {formatActivityDateTime(createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Chip
              label={`${duration} minutes`}
              sx={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                py: { xs: 2, sm: 2.5, md: 3 },
                px: 1,
                border: "1px solid rgba(255,255,255,0.2)",
                "& .MuiChip-label": { px: { xs: 1.5, sm: 2, md: 2.5 } },
              }}
            />
            <Chip
              label={`${calories} calories`}
              sx={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                py: { xs: 2, sm: 2.5, md: 3 },
                px: 1,
                border: "1px solid rgba(255,255,255,0.2)",
                "& .MuiChip-label": { px: { xs: 1.5, sm: 2, md: 2.5 } },
              }}
            />
          </Box>
        </Box>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: "rgba(20,20,20,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
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
                background: "rgba(255,193,7,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,193,7,0.3)",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <CircularProgress size={50} sx={{ mb: 3, color: "#ffc107" }} thickness={4} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#ffc107", textTransform: "uppercase" }}>
                Generating AI Recommendations
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,193,7,0.8)", lineHeight: 1.8 }}>
                Our AI is analyzing your activity. This usually takes a few moments. The page
                refreshes automatically once it&apos;s ready.
              </Typography>
            </Paper>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 4,
                  background: "rgba(102,126,234,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(102,126,234,0.3)",
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
                <Typography paragraph sx={{ mb: 0, lineHeight: 2, color: "rgba(255,255,255,0.9)", fontSize: "1rem" }}>
                  {activity.recommendation}
                </Typography>
              </Paper>

              <ListSection title="💡 Areas for Improvement" color="#ffc107" items={activity.improvements} />
              <ListSection title="✨ Suggestions" color="#9333ea" items={activity.suggestions} />
              <ListSection title="⚠️ Safety Guidelines" color="#f72585" items={activity.safety} />
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
};

export default ActivityDetail;
