import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const userId = useSelector(state => state.auth.userId);
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
      elevation={8}
      sx={{
        borderRadius: 3,
        background: "white",
        position: "sticky",
        top: 16,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Log New Activity
        </Typography>

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
          <FormControl fullWidth sx={{ mb: 2 }}>
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
            inputProps={{ min: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #9ca6ea 0%, #b199c2 100%)",
              },
            }}
          >
            {loading ? "Adding..." : "Add Activity"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
