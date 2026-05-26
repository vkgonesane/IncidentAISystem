import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({
  children,
  refreshing,
  onRefresh,
  activePage,
  onPageChange,
  notifications = [],
  onNotificationClick,
}) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Sidebar activePage={activePage} onPageChange={onPageChange} />

      <Box
        sx={{
          ml: { xs: 0, md: "260px" },
          minHeight: "100vh",
        }}
      >
        <Topbar
          refreshing={refreshing}
          onRefresh={onRefresh}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />

        <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;