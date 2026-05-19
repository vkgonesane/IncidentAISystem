import { Avatar, Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

function Topbar({ refreshing, onRefresh }) {
  return (
    <Box
      sx={{
        height: 76,
        px: { xs: 2, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "rgba(255, 255, 255, 0.86)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Box>
        <Typography variant="h6">Operations Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time incident intelligence and AI-assisted triage
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip
          icon={<BoltOutlinedIcon />}
          label={refreshing ? "Syncing..." : "Auto refresh: 15s"}
          color={refreshing ? "warning" : "success"}
          variant="outlined"
          size="small"
        />

        <IconButton onClick={onRefresh}>
          <RefreshOutlinedIcon />
        </IconButton>

        <IconButton>
          <NotificationsNoneOutlinedIcon />
        </IconButton>

        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: "primary.main",
            fontWeight: 800,
          }}
        >
          RV
        </Avatar>
      </Stack>
    </Box>
  );
}

export default Topbar;