import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { formatDateTime, safeText } from "../../utils/formatters";

function TimelinePanel({ timeline = [], loading = false }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <TimelineOutlinedIcon color="primary" />

          <Box>
            <Typography variant="h6">Incident Timeline</Typography>
            <Typography variant="body2" color="text.secondary">
              Audit history from incident_updates table
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!loading && timeline.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No timeline events found.
          </Typography>
        )}

        {!loading && timeline.length > 0 && (
          <List disablePadding>
            {timeline.map((event, index) => (
              <ListItem
                key={event.id || index}
                alignItems="flex-start"
                sx={{
                  px: 0,
                  borderBottom:
                    index === timeline.length - 1 ? "none" : "1px solid #eef2f7",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {safeText(event.event_type || event.action || event.status, "Timeline event")}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {safeText(event.message || event.notes || event.description, "No details")}
                      </Typography>

                      <Typography
                        component="div"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {formatDateTime(event.created_at || event.timestamp || event.updated_at)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default TimelinePanel;