import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ArrowForward, AutoAwesome } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import AppShell from "../components/AppShell";
import { usePageTitle } from "../hooks/usePageTitle";
import { getActivityMeta } from "../lib/activityMeta";
import { formatShortDate } from "../lib/dates";
import { getUserRecommendations } from "../services/api";

const ListSection = ({ title, color, items }) => {
  if (!items?.length) return null;
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color, fontWeight: 700, letterSpacing: "1.5px", display: "block", mb: 1.5 }}
      >
        {title}
      </Typography>
      <Stack spacing={1.2}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                mt: 1,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const InsightsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  usePageTitle("AI Insights - AEG Fitness");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const { data } = await getUserRecommendations(user.id);
        if (!cancelled) setRecommendations(data || []);
      } catch (err) {
        if (!cancelled) {
          setError("Could not load insights. Please try again.");
          console.error(err);
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

  const filtered = useMemo(() => {
    const sorted = [...recommendations].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (filter === "ALL") return sorted;
    return sorted.filter((r) => r.activityType === filter);
  }, [recommendations, filter]);

  const counts = useMemo(() => {
    const total = recommendations.length;
    const byType = recommendations.reduce((acc, r) => {
      const key = r.activityType || "OTHER";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return { total, byType };
  }, [recommendations]);

  return (
    <AppShell>
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <AutoAwesome sx={{ color: "#9aa9ff" }} />
          <Typography
            variant="overline"
            sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
          >
            AI Insights
          </Typography>
        </Stack>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.5px" }}
        >
          Your <Box component="span" className="gradient-text">coaching feed</Box>
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
          Every recommendation generated for you, in one place.
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
      ) : recommendations.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: "rgba(20,20,20,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
            py: 10,
            px: 3,
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "4rem", mb: 2 }}>
            🤖
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No AI insights yet
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}>
            Log an activity and your AI coach will analyse it within seconds.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/activities")}
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
            }}
          >
            Log an activity
          </Button>
        </Card>
      ) : (
        <>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
            <ToggleButtonGroup
              size="small"
              value={filter}
              exclusive
              onChange={(_, value) => value && setFilter(value)}
              sx={{
                "& .MuiToggleButton-root": {
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 600,
                  borderColor: "rgba(255,255,255,0.1)",
                  "&.Mui-selected": {
                    background: "rgba(102,126,234,0.18)",
                    color: "#fff",
                    borderColor: "rgba(102,126,234,0.4)",
                  },
                },
              }}
            >
              <ToggleButton value="ALL">All ({counts.total})</ToggleButton>
              {Object.entries(counts.byType).map(([type, count]) => (
                <ToggleButton key={type} value={type}>
                  {type} ({count})
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Stack spacing={3}>
            {filtered.map((rec) => {
              const meta = getActivityMeta(rec.activityType);
              return (
                <Card
                  key={rec.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background: "rgba(20,20,20,0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: `${meta.from}66`,
                      transform: "translateY(-3px)",
                      boxShadow: `0 20px 50px ${meta.from}22`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${meta.from} 0%, ${meta.to} 100%)`,
                      px: { xs: 3, md: 4 },
                      py: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography sx={{ fontSize: "2rem" }}>{meta.emoji}</Typography>
                      <Box>
                        <Typography sx={{ fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                          {rec.activityType || "Activity"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                          {formatShortDate(rec.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>
                    {rec.activityId && (
                      <Button
                        size="small"
                        onClick={() => navigate(`/activities/${rec.activityId}`)}
                        endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                          background: "rgba(255,255,255,0.15)",
                          "&:hover": { background: "rgba(255,255,255,0.25)" },
                        }}
                      >
                        Open activity
                      </Button>
                    )}
                  </Box>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {rec.recommendation && (
                      <Box sx={{ mb: 3 }}>
                        <Chip
                          label="Analysis"
                          size="small"
                          sx={{
                            mb: 1.5,
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            background: "rgba(102,126,234,0.15)",
                            border: "1px solid rgba(102,126,234,0.3)",
                            color: "#cdd5ff",
                          }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.8 }}>
                          {rec.recommendation}
                        </Typography>
                      </Box>
                    )}
                    {(rec.improvements?.length || rec.suggestions?.length || rec.safety?.length) ? (
                      <>
                        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 4,
                          }}
                        >
                          <ListSection title="Improvements" color="#ffc107" items={rec.improvements} />
                          <ListSection title="Suggestions" color="#9333ea" items={rec.suggestions} />
                          <ListSection title="Safety" color="#f72585" items={rec.safety} />
                        </Box>
                      </>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </>
      )}
    </AppShell>
  );
};

export default InsightsPage;
