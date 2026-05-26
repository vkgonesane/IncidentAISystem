import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function IncidentTrendChart({ data = [], loading = false }) {
  return (
    <Card sx={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
            7-Day Incident Trend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Daily incident volume from the latest operational window.
          </Typography>
        </Stack>

        {loading ? (
          <Skeleton variant="rounded" height={260} />
        ) : (
          <Box sx={{ width: "100%", minWidth: 0, height: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default IncidentTrendChart;