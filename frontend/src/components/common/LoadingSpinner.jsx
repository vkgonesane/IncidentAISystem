import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingSpinner({ message = "Loading data..." }) {
  return (
    <Box
      sx={{
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={38} />

      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;