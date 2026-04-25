import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  const goToLogin = () => navigate('/login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAuthenticated) {
      setError('Please sign in to log activities');
      return;
    }

    if (!activity.duration || !activity.caloriesBurned) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        userId: userId,
        type: activity.type,
        duration: parseInt(activity.duration),
        caloriesBurned: parseInt(activity.caloriesBurned),
        startTime: new Date().toISOString(),
        additionalMetrics: activity.additionalMetrics
      };
      await addActivity(activityData);
      setSuccess(true);
      setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} });
      
      if (onActivityAdded) {
        setTimeout(() => {
          onActivityAdded();
        }, 500);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: "rgba(20, 20, 20, 0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 90,
        transition: "all 0.3s ease",
        "&:hover": {
          border: "1px solid rgba(102, 126, 234, 0.3)",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          className="gradient-text"
          sx={{
            mb: 3,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Log New Activity
        </Typography>

        {!isAuthenticated && (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={goToLogin} sx={{ fontWeight: 700 }}>
                Sign In
              </Button>
            }
            sx={{ mb: 2 }}
          >
            Sign in required to log activities
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Activity added successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }} disabled={!isAuthenticated}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={activity.type}
              label="Activity Type"
              onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            >
              <MenuItem value="RUNNING">🏃 Running</MenuItem>
              <MenuItem value="WALKING">🚶 Walking</MenuItem>
              <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Duration (Minutes)"
            type="number"
            sx={{ mb: 2 }}
            value={activity.duration}
            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            required
            disabled={!isAuthenticated}
            inputProps={{ min: 1 }}
          />

          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            sx={{ mb: 3 }}
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            required
            disabled={!isAuthenticated}
            inputProps={{ min: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !isAuthenticated}
            sx={{
              py: 2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transition: "left 0.5s",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                transform: "translateY(-3px)",
                "&:before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "rgba(102, 126, 234, 0.3)",
                color: "rgba(255, 255, 255, 0.4)",
              },
            }}
          >
            {loading ? "Adding..." : isAuthenticated ? "Add Activity" : "Sign in to Add"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
