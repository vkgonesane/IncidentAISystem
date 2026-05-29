import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";

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
        <Typography variant="h6">
          VendorIQ Dashboard
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Real-time vendor incident intelligence and AI-assisted triage
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
        }}
      >
        <Chip
          icon={<BoltOutlinedIcon />}
          label={refreshing ? "Syncing..." : "Auto refresh: 15s"}
          color={refreshing ? "warning" : "success"}
          variant="outlined"
          size="small"
        />

        <Tooltip title="Refresh dashboard data">
          <IconButton onClick={onRefresh}>
            <RefreshOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Chip
          avatar={
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "#ffffff",
                fontWeight: 900,
              }}
            >
              V
            </Avatar>
          }
          label="Vaibhav"
          sx={{
            fontWeight: 800,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        />
      </Stack>
    </Box>
  );
}

export default Topbar;