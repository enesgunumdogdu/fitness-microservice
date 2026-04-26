import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  CalendarMonth,
  Email,
  Logout,
  Person,
  ShieldOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import AppShell from "../components/AppShell";
import { getUserProfile } from "../services/api";

const formatLong = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        background: "rgba(102,126,234,0.15)",
        border: "1px solid rgba(102,126,234,0.3)",
        display: "grid",
        placeItems: "center",
        color: "#9aa9ff",
        flexShrink: 0,
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, color: "rgba(255,255,255,0.95)", mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Profile - AEG Fitness";
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const { data } = await getUserProfile(user.id);
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your profile. Showing cached data.");
          setProfile(user);
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
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const data = profile || user;
  const initials = data
    ? `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase() ||
      data.email?.[0]?.toUpperCase() ||
      "?"
    : "?";
  const fullName = data
    ? [data.firstName, data.lastName].filter(Boolean).join(" ") || "Anonymous"
    : "—";

  return (
    <AppShell maxWidth="md">
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: "#9aa9ff", fontWeight: 700, letterSpacing: "2px" }}
        >
          Profile
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, letterSpacing: "-0.5px" }}>
          Your <Box component="span" className="gradient-text">account</Box>
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !data ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#667eea" }} thickness={4} />
        </Box>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: "rgba(20,20,20,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.18) 0%, rgba(118,75,162,0.18) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              p: { xs: 4, md: 5 },
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar
              sx={{
                width: 88,
                height: 88,
                fontSize: "2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                boxShadow: "0 8px 32px rgba(102,126,234,0.4)",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px", mb: 0.5 }}>
                {fullName}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>{data?.email || "—"}</Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack divider={<Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />}>
              <InfoRow icon={Person} label="Full name" value={fullName} />
              <InfoRow icon={Email} label="Email" value={data?.email || "—"} />
              <InfoRow
                icon={CalendarMonth}
                label="Member since"
                value={formatLong(data?.createdAt)}
              />
              <InfoRow
                icon={UpdateOutlined}
                label="Last updated"
                value={formatLong(data?.updatedAt)}
              />
              <InfoRow
                icon={ShieldOutlined}
                label="Authentication"
                value="Self-hosted JWT (RS256) · Refresh token rotation"
              />
            </Stack>
          </CardContent>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderColor: "rgba(244,67,54,0.4)",
                color: "#ff8a80",
                "&:hover": {
                  borderColor: "#ff5252",
                  background: "rgba(244,67,54,0.08)",
                },
              }}
            >
              Sign out
            </Button>
          </Box>
        </Card>
      )}
    </AppShell>
  );
};

export default ProfilePage;
