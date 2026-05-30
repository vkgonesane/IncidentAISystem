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

function IncidentTable({
  incidents = [],
  loading,
  error,
  onIncidentClick,
}) {
  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 5,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 18px rgba(15,23,42,0.035)",
        }}
      >
        <LoadingSpinner message="Loading operational incidents..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 3,
          borderRadius: 3,
          fontWeight: 700,
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card
      sx={{
        border: "1px solid rgba(226,232,240,0.9)",
        borderRadius: 5,
        boxShadow: "0 4px 18px rgba(15,23,42,0.035)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid #e2e8f0",
            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                backgroundColor: "rgba(16,185,129,0.10)",
                color: "#047857",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(16,185,129,0.16)",
              }}
            >
              <QueueOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                }}
              >
                Incident Queue
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Operational incidents enriched with SLA, impact, source, and AI signals.
              </Typography>
            </Box>
          </Box>

          <Chip
            size="small"
            label={`${incidents.length} records`}
            sx={{
              backgroundColor: "#f8fafc",
              color: "#475569",
              fontWeight: 800,
              border: "1px solid #e2e8f0",
            }}
          />
        </Box>

        {incidents.length === 0 ? (
          <EmptyState
            title="No operational incidents found"
            description="There are no incidents matching the current filters."
          />
        ) : (
          <TableContainer
            sx={{
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 1100,
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f8fafc",

                    "& th": {
                      fontSize: 11,
                      fontWeight: 900,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid #e2e8f0",
                      py: 1.6,
                      whiteSpace: "nowrap",
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

              <TableBody
                sx={{
                  "& tr": {
                    transition: "background-color 0.2s ease",
                  },

                  "& tr:hover": {
                    backgroundColor: "#f8fafc",
                  },

                  "& td": {
                    borderBottom: "1px solid #f1f5f9",
                    py: 1.8,
                  },
                }}
              >
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