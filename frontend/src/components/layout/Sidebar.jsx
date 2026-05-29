import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";

import VendorIQLogo from "../brand/VendorIQLogo";

const menuItems = [
  {
    label: "Incident Command",
    icon: <DashboardOutlinedIcon />,
    path: "/dashboard",
  },
  {
    label: "Intelligence Guide",
    icon: <AutoAwesomeOutlinedIcon />,
    path: "/intelligence-guide",
  },
  {
    label: "Notification Settings",
    icon: (
      <NotificationsActiveOutlinedIcon />
    ),
    path: "/notification-settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 280,
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        boxShadow:
          "0 2px 14px rgba(15,23,42,0.04)",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <VendorIQLogo size={42} />

          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#0f172a",
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: "-0.03em",
              }}
            >
              VendorIQ
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#64748b",
                mt: 0.3,
              }}
            >
              INTELLIGENT. REALTIME.
              RELIABLE.
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Vendor Incident Intelligence
        </Typography>

        <Chip
          label="Realtime Monitoring"
          size="small"
          sx={{
            mt: 2,
            backgroundColor:
              "rgba(16,185,129,0.12)",
            color: "#047857",
            fontWeight: 800,
            border:
              "1px solid rgba(16,185,129,0.16)",
          }}
        />
      </Box>

      <Divider
        sx={{
          borderColor: "#e2e8f0",
        }}
      />

      <List
        sx={{
          px: 2,
          py: 2,
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={{
              textDecoration: "none",
            }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: 4,
                  mb: 1,
                  py: 1.4,

                  color: isActive
                    ? "#047857"
                    : "#475569",

                  backgroundColor: isActive
                    ? "rgba(16,185,129,0.12)"
                    : "transparent",

                  border: isActive
                    ? "1px solid rgba(16,185,129,0.16)"
                    : "1px solid transparent",

                  "&:hover": {
                    backgroundColor:
                      "rgba(16,185,129,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,

                    color: isActive
                      ? "#10b981"
                      : "#64748b",
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
                        fontWeight: isActive
                          ? 800
                          : 700,
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2.5,
        }}
      >
        <Box
          sx={{
            p: 2.5,
            borderRadius: 5,
            background:
              "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",

            border: "1px solid #e2e8f0",
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#0f172a",
                  fontWeight: 800,
                }}
              >
                {user?.full_name ||
                  "Authenticated User"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                }}
              >
                {user?.email}
              </Typography>
            </Box>

            <Chip
              label={user?.role || "ADMIN"}
              size="small"
              sx={{
                width: "fit-content",

                background:
                  "linear-gradient(135deg, #10b981, #059669)",

                color: "#ffffff",

                fontWeight: 800,
              }}
            />

            <Divider
              sx={{
                borderColor: "#e2e8f0",
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                lineHeight: 1.7,
              }}
            >
              FastAPI + React +
              AI-assisted operational
              intelligence
            </Typography>

            <Button
              variant="contained"
              startIcon={
                <LogoutRoundedIcon />
              }
              onClick={handleLogout}
              sx={{
                mt: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,

                background:
                  "linear-gradient(135deg, #10b981, #059669)",

                boxShadow:
                  "0 10px 20px rgba(16,185,129,0.18)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #059669, #047857)",
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;