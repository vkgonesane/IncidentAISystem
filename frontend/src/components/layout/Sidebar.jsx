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
            fontSize: 18,
          }}
        >
          VQ
        </Box>

        <Typography variant="h6" sx={{ color: "#ffffff", lineHeight: 1.2 }}>
          VendorIQ
        </Typography>

        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          Vendor Incident Intelligence
        </Typography>

        <Typography variant="caption" sx={{ color: "#cbd5e1", mt: 1.2, display: "block" }}>
          Built by Vaibhav
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.18)" }} />

      <List sx={{ px: 1.5, py: 2 }}>
        <ListItemButton
          sx={{
            borderRadius: 3,
            mb: 0.75,
            color: "#ffffff",
            backgroundColor: "rgba(37, 99, 235, 0.22)",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.28)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "#60a5fa",
            }}
          >
            <DashboardOutlinedIcon />
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Incident Command
              </Typography>
            }
          />
        </ListItemButton>
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
            FastAPI + React + AIOps Intelligence
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;