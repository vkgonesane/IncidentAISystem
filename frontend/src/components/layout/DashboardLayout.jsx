import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children, refreshing, onRefresh }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Sidebar />

      <Box
        sx={{
          ml: { xs: 0, md: "260px" },
          minHeight: "100vh",
        }}
      >
        <Topbar refreshing={refreshing} onRefresh={onRefresh} />

        <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;