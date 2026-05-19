import { Box, Typography, Button } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyState({
  title = "No data found",
  description = "There is nothing to show right now.",
  actionLabel,
  onAction,
}) {
  return (
    <Box
      sx={{
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 4,
        color: "text.secondary",
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 54, mb: 1.5, opacity: 0.7 }} />

      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>

      <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 420 }}>
        {description}
      </Typography>

      {actionLabel && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;