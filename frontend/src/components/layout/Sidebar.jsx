import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const menuItems = [
  {
    label: "Incident Command",
    icon: <DashboardOutlinedIcon />,
    active: true,
  },
  {
    label: "AI Insights",
    icon: <SmartToyOutlinedIcon />,
  },
  {
    label: "Timeline",
    icon: <TimelineOutlinedIcon />,
  },
  {
    label: "Reliability",
    icon: <ShieldOutlinedIcon />,
  },
  {
    label: "Settings",
    icon: <SettingsOutlinedIcon />,
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        color: "#e5e7eb",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          IA
        </Box>

        <Typography variant="h6" sx={{ color: "#ffffff", lineHeight: 1.2 }}>
          Incident AI
        </Typography>

        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          AIOps Command Center
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.18)" }} />

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            sx={{
              borderRadius: 3,
              mb: 0.75,
              color: item.active ? "#ffffff" : "#cbd5e1",
              backgroundColor: item.active
                ? "rgba(37, 99, 235, 0.22)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(148, 163, 184, 0.12)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: item.active ? "#60a5fa" : "#94a3b8",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography
                  component="span"
                  sx={{
                    fontSize: 14,
                    fontWeight: item.active ? 800 : 600,
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#ffffff" }}>
            Portfolio Build
          </Typography>

          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            FastAPI + React + Rule-based AI
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;