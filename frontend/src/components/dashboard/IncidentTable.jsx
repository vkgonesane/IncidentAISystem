import {
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ px: 2.5, py: 2 }}>
          Incident Queue
        </Typography>

        {incidents.length === 0 ? (
          <EmptyState
            title="No incidents found"
            description="Try changing filters or check if backend has incident data."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Incident</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Vendor / Env</TableCell>
                  <TableCell>Error Code</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Duplicates</TableCell>
                  <TableCell>AI Confidence</TableCell>
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