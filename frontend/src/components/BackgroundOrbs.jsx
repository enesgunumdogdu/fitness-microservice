import { Box } from "@mui/material";

const SHELL_ORBS = [
  {
    sx: {
      position: "absolute",
      top: "-20%",
      right: "-10%",
      width: "50%",
      height: "50%",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)",
      filter: "blur(80px)",
    },
  },
  {
    sx: {
      position: "absolute",
      bottom: "-20%",
      left: "-10%",
      width: "50%",
      height: "50%",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%)",
      filter: "blur(80px)",
    },
  },
];

const AUTH_ORBS = [
  {
    sx: {
      position: "absolute",
      top: "-10%",
      right: "-5%",
      width: "50%",
      height: "50%",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)",
      filter: "blur(80px)",
      animation: "float 6s ease-in-out infinite",
    },
  },
  {
    sx: {
      position: "absolute",
      bottom: "-10%",
      left: "-5%",
      width: "45%",
      height: "45%",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)",
      filter: "blur(80px)",
      animation: "float 8s ease-in-out infinite",
    },
  },
  {
    sx: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "60%",
      height: "60%",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)",
      filter: "blur(100px)",
    },
  },
];

const VARIANTS = {
  shell: { orbs: SHELL_ORBS, container: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 } },
  auth: { orbs: AUTH_ORBS, container: null },
};

const BackgroundOrbs = ({ variant = "shell" }) => {
  const config = VARIANTS[variant] || VARIANTS.shell;
  const orbs = config.orbs.map((orb, index) => <Box key={index} sx={orb.sx} />);
  if (!config.container) return <>{orbs}</>;
  return <Box sx={config.container}>{orbs}</Box>;
};

export default BackgroundOrbs;
