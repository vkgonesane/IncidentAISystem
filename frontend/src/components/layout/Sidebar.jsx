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

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

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
    icon: (
      <AutoAwesomeOutlinedIcon />
    ),
    path: "/intelligence-guide",
  },

  {
    label:
      "Notification Settings",

    icon: (
      <NotificationsActiveOutlinedIcon />
    ),

    path:
      "/notification-settings",
  },
];

function Sidebar() {
  const navigate =
    useNavigate();

  const { user, logout } =
    useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 280,

        minHeight: "100vh",

        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

        borderRight:
          "1px solid rgba(226,232,240,0.9)",

        display: {
          xs: "none",
          md: "flex",
        },

        flexDirection: "column",

        position: "fixed",

        left: 0,
        top: 0,

        boxShadow:
          "0 4px 24px rgba(15,23,42,0.03)",
      }}
    >
      <Box
        sx={{
          p: 3.5,
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1.6,

            mb: 2.5,
          }}
        >
          <VendorIQLogo
            size={42}
          />

          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#0f172a",

                lineHeight: 1,

                fontWeight: 950,

                letterSpacing:
                  "-0.04em",
              }}
            >
              VendorIQ
            </Typography>

            <Typography
              sx={{
                fontSize: 10,

                fontWeight: 800,

                letterSpacing:
                  "0.14em",

                color: "#94a3b8",

                mt: 0.5,
              }}
            >
              OPERATIONAL
              INTELLIGENCE
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            color: "#64748b",

            lineHeight: 1.7,

            fontSize: 13,

            maxWidth: 220,
          }}
        >
          AI-assisted vendor
          incident monitoring and
          operational analysis.
        </Typography>

        <Chip
          label="Realtime Monitoring"
          size="small"
          sx={{
            mt: 2.5,

            backgroundColor:
              "rgba(16,185,129,0.10)",

            color: "#047857",

            fontWeight: 800,

            border:
              "1px solid rgba(16,185,129,0.14)",
          }}
        />
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(226,232,240,0.8)",
        }}
      />

      <List
        sx={{
          px: 2,
          py: 2.5,
        }}
      >
        {menuItems.map(
          (item) => (
            <NavLink
              key={item.label}
              to={item.path}
              style={{
                textDecoration:
                  "none",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  sx={{
                    borderRadius: 4,

                    mb: 1,

                    py: 1.5,

                    px: 1.6,

                    color: isActive
                      ? "#047857"
                      : "#475569",

                    backgroundColor:
                      isActive
                        ? "rgba(16,185,129,0.10)"
                        : "transparent",

                    border: isActive
                      ? "1px solid rgba(16,185,129,0.14)"
                      : "1px solid transparent",

                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      backgroundColor:
                        "rgba(16,185,129,0.06)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,

                      color: isActive
                        ? "#10b981"
                        : "#94a3b8",
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

                          fontWeight:
                            isActive
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
          )
        )}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2.5,
        }}
      >
        <Box
          sx={{
            p: 2.1,

            borderRadius: 4,

            background: "#ffffff",

            border:
              "1px solid rgba(226,232,240,0.9)",

            boxShadow:
              "0 2px 10px rgba(15,23,42,0.03)",
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography
                sx={{
                  color: "#0f172a",

                  fontWeight: 850,

                  fontSize: 14,
                }}
              >
                {user?.full_name ||
                  "Authenticated User"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,

                  color: "#94a3b8",

                  fontSize: 12,
                }}
              >
                {user?.email}
              </Typography>
            </Box>

            <Chip
              label={
                user?.role ||
                "ADMIN"
              }
              size="small"
              sx={{
                width:
                  "fit-content",

                background:
                  "linear-gradient(135deg, #10b981, #059669)",

                color:
                  "#ffffff",

                fontWeight: 800,
              }}
            />

            <Divider
              sx={{
                borderColor:
                  "#e2e8f0",
              }}
            />

            <Typography
              sx={{
                color: "#64748b",

                lineHeight: 1.7,

                fontSize: 12,
              }}
            >
              FastAPI + React +
              AI-assisted operational
              intelligence platform.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              startIcon={
                <LogoutRoundedIcon />
              }
              onClick={handleLogout}
              sx={{
                mt: 1,

                borderRadius: 2.5,

                textTransform:
                  "none",

                fontWeight: 800,

                background:
                  "linear-gradient(135deg, #10b981, #059669)",

                boxShadow:
                  "0 6px 14px rgba(16,185,129,0.14)",

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