import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 6,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Made with
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.2rem",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
              },
            }}
          >
            💜
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            by
          </Typography>
          <Link
            href="https://enesgunumdogdu.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            className="gradient-text"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                filter: "brightness(1.2)",
              },
            }}
          >
            3nes
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

