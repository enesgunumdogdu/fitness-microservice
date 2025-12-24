import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
} from "@mui/icons-material";
import Footer from "../components/Footer";
import { registerUser } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Register - AEG Fitness";
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.5)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(102, 126, 234, 0.5)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "45%",
          height: "45%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          flex: 1,
          py: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.25)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
            },
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.8) 100%)",
              py: 4,
              px: 4,
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                opacity: 0.1,
                zIndex: 0,
              }}
            />
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: 44,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                mb: 2,
                mx: "auto",
                position: "relative",
                zIndex: 1,
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                animation: "glow 3s ease-in-out infinite",
              }}
            >
              🏋️
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              className="gradient-text"
              sx={{
                fontWeight: 900,
                mb: 1,
                letterSpacing: "1px",
                textTransform: "uppercase",
                position: "relative",
                zIndex: 1,
              }}
            >
              Join AEG Fitness
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              Start your fitness journey today
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {success ? (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  backgroundColor: "rgba(46, 125, 50, 0.1)",
                  border: "1px solid rgba(46, 125, 50, 0.3)",
                }}
              >
                Registration successful! Redirecting to login...
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {apiError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {apiError}
                  </Alert>
                )}

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={loading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={loading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputStyles}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  sx={{ ...inputStyles, mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  sx={{ ...inputStyles, mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={loading}
                  sx={{ ...inputStyles, mb: 3 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transition: "left 0.5s",
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                      transform: "translateY(-3px)",
                      "&:before": {
                        left: "100%",
                      },
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      sx={{
                        color: "#667eea",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default RegisterPage;

