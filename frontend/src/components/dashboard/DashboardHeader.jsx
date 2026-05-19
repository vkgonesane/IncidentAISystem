import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

function DashboardHeader() {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 5,
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.10))",
        border: "1px solid rgba(148, 163, 184, 0.25)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Chip
            icon={<AutoAwesomeOutlinedIcon />}
            label="AI-assisted incident operations"
            color="secondary"
            variant="outlined"
            sx={{ mb: 1.5 }}
          />

          <Typography variant="h4">
            Incident AI Command Center
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 760 }}
          >
            Monitor alerts, detect duplicates, review AI-generated root cause analysis,
            and resolve incidents from one professional AIOps dashboard.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddAlertOutlinedIcon />}
          >
            New Manual Alert
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default DashboardHeader;