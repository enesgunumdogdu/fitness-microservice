import { Box, Button, Card, Chip, Container, Stack, Typography } from "@mui/material";
import {
  ArrowForward,
  AutoAwesome,
  BoltOutlined,
  DirectionsBike,
  DirectionsRun,
  DirectionsWalk,
  InsightsOutlined,
  LockOutlined,
  TrendingUp,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../auth/useAuth";
import AppShell from "../components/AppShell";
import { usePageTitle } from "../hooks/usePageTitle";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Track every session",
    body: "Log running, walking and cycling with duration and calories. Your full history, always one click away.",
    color: "#667eea",
  },
  {
    icon: AutoAwesome,
    title: "AI-powered insights",
    body: "Each activity is analysed by Gemini to surface improvements, suggestions and safety guidance tailored to you.",
    color: "#9333ea",
  },
  {
    icon: InsightsOutlined,
    title: "Personal coach feed",
    body: "Your last 30 days of recommendations are aggregated into a single feed so progress is never lost.",
    color: "#00d4ff",
  },
  {
    icon: BoltOutlined,
    title: "Event-driven backend",
    body: "Activities flow through RabbitMQ so AI feedback arrives the moment the workout ends — no manual refresh.",
    color: "#ff6b35",
  },
  {
    icon: LockOutlined,
    title: "Self-hosted auth",
    body: "RS256 JWTs issued by our own auth service. No third-party redirect, no vendor lock-in, full UX control.",
    color: "#f72585",
  },
  {
    icon: DirectionsRun,
    title: "Built for the long run",
    body: "Cloud-native architecture with Eureka, Spring Cloud Gateway and Flyway migrations — production patterns from day one.",
    color: "#3ddc84",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    body: "Sign up in under 30 seconds with email and password. No external identity provider in the way.",
  },
  {
    number: "02",
    title: "Log your activity",
    body: "Pick a type (run, walk, cycle), enter duration and calories. The activity is queued for AI analysis instantly.",
  },
  {
    number: "03",
    title: "Get personalised coaching",
    body: "Open the activity to read AI-generated analysis, improvements and safety notes. Aggregate everything in your insights feed.",
  },
];

const ACTIVITY_PILLS = [
  { icon: DirectionsRun, label: "Running", from: "#FF6B6B", to: "#FF8E53" },
  { icon: DirectionsWalk, label: "Walking", from: "#4ECDC4", to: "#44A08D" },
  { icon: DirectionsBike, label: "Cycling", from: "#A8E6CF", to: "#3DDC84" },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  usePageTitle("AEG Fitness - Track smarter. Train better.");

  const primaryCta = isAuthenticated
    ? { label: "Open dashboard", to: "/dashboard" }
    : { label: "Start free", to: "/register" };

  const secondaryCta = isAuthenticated
    ? { label: "Log an activity", to: "/activities" }
    : { label: "Sign in", to: "/login" };

  return (
    <AppShell maxWidth={false} disableContainer>
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 14 } }}>
        <Box sx={{ textAlign: "center", maxWidth: 880, mx: "auto" }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: "-1px",
              lineHeight: 1.05,
              fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.8rem" },
              mb: 3,
            }}
          >
            Train smarter with{" "}
            <Box component="span" className="gradient-text">
              your own AI coach
            </Box>
            .
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              maxWidth: 720,
              mx: "auto",
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            AEG Fitness logs every workout, sends it through an event-driven pipeline and returns
            personalised analysis, improvements and safety notes within seconds — all on your own
            stack, with no third-party identity provider in the loop.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              component={RouterLink}
              to={primaryCta.to}
              sx={{
                px: 4,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderRadius: 2,
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102,126,234,0.45)",
                "&:hover": {
                  background: "linear-gradient(135deg,#5568d3 0%,#6a3f8f 100%)",
                  boxShadow: "0 12px 40px rgba(102,126,234,0.6)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {primaryCta.label}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to={secondaryCta.to}
              sx={{
                px: 4,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderRadius: 2,
                color: "white",
                borderColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  borderColor: "#667eea",
                  background: "rgba(102,126,234,0.08)",
                },
              }}
            >
              {secondaryCta.label}
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
            {ACTIVITY_PILLS.map(({ icon: Icon, label, from, to }) => (
              <Chip
                key={label}
                icon={<Icon sx={{ fontSize: 18 }} />}
                label={label}
                sx={{
                  px: 1.5,
                  py: 2.2,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  color: "white",
                  background: `linear-gradient(135deg, ${from}33 0%, ${to}33 100%)`,
                  border: `1px solid ${from}66`,
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%)",
              backdropFilter: "blur(20px)",
              p: { xs: 3, md: 5 },
              boxShadow: "0 30px 80px rgba(102,126,234,0.18)",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
                gap: { xs: 4, md: 6 },
                alignItems: "center",
              }}
            >
              <Box>
                <Chip
                  label="Live AI insight"
                  size="small"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    color: "#9aa9ff",
                    background: "rgba(102,126,234,0.15)",
                    border: "1px solid rgba(102,126,234,0.3)",
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    letterSpacing: "-0.5px",
                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                  }}
                >
                  Every workout becomes coaching feedback.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, mb: 3 }}
                >
                  Activities are published to RabbitMQ the moment you save them. The AI service
                  consumes them, calls Gemini, and writes recommendations back to MongoDB so the
                  next time you open the activity, your coach is already there.
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    "Analysis tailored to your activity type and intensity",
                    "Concrete improvements you can apply on the next session",
                    "Safety guidelines to avoid injury and overtraining",
                  ].map((line) => (
                    <Box key={line} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#667eea",
                          mt: 1.2,
                          flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>{line}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Card
                elevation={0}
                sx={{
                  background: "rgba(10,10,10,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: "linear-gradient(135deg,#FF6B6B 0%,#FF8E53 100%)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                    }}
                  >
                    🏃
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                      Running · 32 min · 410 cal
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Logged moments ago
                    </Typography>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    background: "rgba(102,126,234,0.08)",
                    border: "1px solid rgba(102,126,234,0.25)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "0.5px" }}>
                    ANALYSIS
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", mt: 0.5, lineHeight: 1.7 }}>
                    Solid pace at a sustainable heart-rate zone. Your stride frequency suggests you
                    can extend the next session by 5–7 minutes without compromising form.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,193,7,0.08)",
                    border: "1px solid rgba(255,193,7,0.25)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#ffc107", fontWeight: 700, letterSpacing: "0.5px" }}>
                    SUGGESTION
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", mt: 0.5, lineHeight: 1.7 }}>
                    Add a 5-minute mobility cooldown — calf raises and hip openers — to lock in
                    today&apos;s gains.
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
            >
              Why AEG Fitness
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: "-0.5px" }}
            >
              Production patterns. Personal scale.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 640, mx: "auto" }}>
              Built as a real microservice platform — service discovery, gateway-level JWT
              validation, event-driven AI, versioned migrations — packaged for a single user.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {FEATURES.map(({ icon: Icon, title, body, color }) => (
              <Card
                key={title}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "rgba(20,20,20,0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    border: `1px solid ${color}66`,
                    boxShadow: `0 20px 60px ${color}22`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: `${color}20`,
                    border: `1px solid ${color}40`,
                    display: "grid",
                    placeItems: "center",
                    color,
                    mb: 2.5,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.2px" }}>
                  {title}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {body}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
            >
              How it works
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mt: 1, letterSpacing: "-0.5px" }}
            >
              Three steps to your first AI insight.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {STEPS.map((step) => (
              <Card
                key={step.number}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "rgba(20,20,20,0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  variant="h2"
                  className="gradient-text"
                  sx={{ fontWeight: 900, fontSize: "3rem", mb: 1, letterSpacing: "-1px" }}
                >
                  {step.number}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {step.body}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 10, md: 14 } }}>
          <Box
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: 4,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.18) 0%, rgba(118,75,162,0.18) 100%)",
              border: "1px solid rgba(102,126,234,0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                letterSpacing: "-0.5px",
                fontSize: { xs: "2rem", md: "2.8rem" },
              }}
            >
              Ready to meet your AI coach?
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.75)",
                mb: 4,
                maxWidth: 540,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Free to use, self-hosted, no third-party identity provider. Sign up in under a
              minute and log your first activity today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              component={RouterLink}
              to={primaryCta.to}
              sx={{
                px: 5,
                py: 2,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderRadius: 2,
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102,126,234,0.5)",
                "&:hover": {
                  background: "linear-gradient(135deg,#5568d3 0%,#6a3f8f 100%)",
                  boxShadow: "0 12px 40px rgba(102,126,234,0.65)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {primaryCta.label}
            </Button>
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
};

export default LandingPage;
