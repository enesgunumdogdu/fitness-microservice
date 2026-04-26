import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddCircleOutline,
  ArrowForward,
  AutoAwesome,
  LocalFireDepartment,
  Speed,
  Timer,
  TrendingUp,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import AppShell from "../components/AppShell";
import { getActivities, getUserRecommendations } from "../services/api";

const ACTIVITY_META = {
  RUNNING: { emoji: "🏃", from: "#FF6B6B", to: "#FF8E53" },
  WALKING: { emoji: "🚶", from: "#4ECDC4", to: "#44A08D" },
  CYCLING: { emoji: "🚴", from: "#A8E6CF", to: "#3DDC84" },
};

const formatRelative = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <Card
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      background: "rgba(20,20,20,0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        border: `1px solid ${accent}66`,
        boxShadow: `0 16px 40px ${accent}22`,
      },
    }}
  >
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        background: `${accent}20`,
        border: `1px solid ${accent}40`,
        display: "grid",
        placeItems: "center",
        color: accent,
        mb: 2,
      }}
    >
      <Icon />
    </Box>
    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: "-1px" }}>
      {value}
    </Typography>
  </Card>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.firstName || "there";
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Dashboard - AEG Fitness";
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [activitiesRes, recommendationsRes] = await Promise.allSettled([
          getActivities(),
          user?.id ? getUserRecommendations(user.id) : Promise.resolve({ data: [] }),
        ]);
        if (cancelled) return;

        if (activitiesRes.status === "fulfilled") {
          setActivities(activitiesRes.value.data || []);
        } else {
          setError("Could not load activities. Please try again.");
        }

        if (recommendationsRes.status === "fulfilled") {
          setRecommendations(recommendationsRes.value.data || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = activities.length;
    const minutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
    const calories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = activities.filter((a) => new Date(a.createdAt).getTime() >= weekAgo).length;
    return { total, minutes, calories, thisWeek };
  }, [activities]);

  const recentActivities = useMemo(
    () =>
      [...activities]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [activities]
  );

  const latestRecommendation = useMemo(
    () =>
      [...recommendations].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0],
    [recommendations]
  );

  return (
    <AppShell>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
        >
          Dashboard
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
          Welcome back, <Box component="span" className="gradient-text">{firstName}</Box>.
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
          Here&apos;s a snapshot of your training and the latest insight from your AI coach.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#667eea" }} thickness={4} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            <StatCard icon={TrendingUp} label="Total activities" value={stats.total} accent="#667eea" />
            <StatCard icon={Timer} label="Total minutes" value={stats.minutes} accent="#9333ea" />
            <StatCard icon={LocalFireDepartment} label="Calories burned" value={stats.calories} accent="#ff6b35" />
            <StatCard icon={Speed} label="Last 7 days" value={stats.thisWeek} accent="#3ddc84" />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
              gap: 3,
            }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: "rgba(20,20,20,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                    Recent activities
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate("/activities")}
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                    sx={{ color: "#9aa9ff", fontWeight: 600, letterSpacing: "0.5px" }}
                  >
                    View all
                  </Button>
                </Stack>

                {recentActivities.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
                      🏋️
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      No activities yet
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}>
                      Log your first session to see it appear here.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutline />}
                      onClick={() => navigate("/activities")}
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                      }}
                    >
                      Log activity
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {recentActivities.map((activity) => {
                      const meta = ACTIVITY_META[activity.type] || ACTIVITY_META.RUNNING;
                      return (
                        <Box
                          key={activity.id}
                          onClick={() => navigate(`/activities/${activity.id}`)}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.06)",
                            background: "rgba(255,255,255,0.02)",
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: `${meta.from}66`,
                              background: `linear-gradient(135deg, ${meta.from}10 0%, ${meta.to}10 100%)`,
                              transform: "translateX(4px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${meta.from} 0%, ${meta.to} 100%)`,
                              display: "grid",
                              placeItems: "center",
                              fontSize: 24,
                            }}
                          >
                            {meta.emoji}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                              {activity.type}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
                              {formatRelative(activity.createdAt)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={`${activity.duration} min`}
                              size="small"
                              sx={{
                                background: "rgba(102,126,234,0.15)",
                                border: "1px solid rgba(102,126,234,0.3)",
                                color: "#cdd5ff",
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={`${activity.caloriesBurned} cal`}
                              size="small"
                              sx={{
                                background: "rgba(255,107,53,0.12)",
                                border: "1px solid rgba(255,107,53,0.3)",
                                color: "#ffb691",
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(102,126,234,0.25)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: "rgba(102,126,234,0.2)",
                      border: "1px solid rgba(102,126,234,0.4)",
                      display: "grid",
                      placeItems: "center",
                      color: "#9aa9ff",
                    }}
                  >
                    <AutoAwesome />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "1.5px" }}>
                      AI Coach
                    </Typography>
                    <Typography sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                      Latest insight
                    </Typography>
                  </Box>
                </Stack>

                {latestRecommendation ? (
                  <>
                    <Chip
                      label={latestRecommendation.activityType || "Activity"}
                      size="small"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.7,
                        mb: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {latestRecommendation.recommendation || "No analysis text available."}
                    </Typography>
                    <Button
                      onClick={() => navigate("/insights")}
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                      sx={{ color: "white", fontWeight: 700, letterSpacing: "0.5px", p: 0 }}
                    >
                      Open insights feed
                    </Button>
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
                      🤖
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      No insights yet
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
                      Log an activity and your AI coach will analyse it within seconds.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </AppShell>
  );
};

export default DashboardPage;
