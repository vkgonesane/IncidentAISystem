import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";

function IncidentFilters({
  filters,
  searchTerm,
  onSearchChange,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", lg: "center" }}
        >
          <TextField
            label="Search incidents"
            placeholder="Search vendor, error code, environment..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            size="small"
            sx={{ minWidth: { lg: 320 } }}
          />

          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(event) => onFilterChange("status", event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </TextField>

          <TextField
            select
            label="Severity"
            value={filters.severity}
            onChange={(event) => onFilterChange("severity", event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </TextField>

          <TextField
            label="Vendor"
            value={filters.vendor}
            onChange={(event) => onFilterChange("vendor", event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          />

          <TextField
            label="Environment"
            value={filters.environment}
            onChange={(event) => onFilterChange("environment", event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          />

          <TextField
            label="Error Code"
            value={filters.error_code}
            onChange={(event) => onFilterChange("error_code", event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          />

          <Box sx={{ flex: 1 }} />

          <Button
            variant="outlined"
            startIcon={<FilterAltOffOutlinedIcon />}
            onClick={onResetFilters}
            sx={{ whiteSpace: "nowrap" }}
          >
            Reset
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default IncidentFilters;