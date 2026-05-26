import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import QueueOutlinedIcon from "@mui/icons-material/QueueOutlined";

import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";
import IncidentRow from "./IncidentRow";

function IncidentTable({ incidents, loading, error, onIncidentClick }) {
  if (loading) {
    return (
      <Card>
        <LoadingSpinner message="Loading incidents from FastAPI..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #a7f3d0",
              }}
            >
              <QueueOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Incident Queue
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Prioritized operational alerts enriched with SLA, impact, and AI signals
              </Typography>
            </Box>
          </Box>

          <Chip
            size="small"
            label={`${incidents.length} active records`}
            sx={{
              backgroundColor: "#f1f5f9",
              color: "#334155",
              fontWeight: 800,
              border: "1px solid #cbd5e1",
            }}
          />
        </Box>

        {incidents.length === 0 ? (
          <EmptyState
            title="No incidents found"
            description="Try changing filters or check if backend has incident data."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f8fafc",
                    "& th": {
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      borderBottom: "1px solid #e2e8f0",
                      py: 1.4,
                    },
                  }}
                >
                  <TableCell>Incident</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Vendor / Env</TableCell>
                  <TableCell>Error / SLA</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>AI Signal</TableCell>
                  <TableCell>Last Seen</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {incidents.map((incident) => (
                  <IncidentRow
                    key={incident.id}
                    incident={incident}
                    onClick={onIncidentClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default IncidentTable;