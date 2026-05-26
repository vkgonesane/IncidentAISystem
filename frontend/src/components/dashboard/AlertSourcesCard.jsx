import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

function AlertSourcesCard({ sources = [], loading = false }) {
  const total = sources.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Alert Sources
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Ingestion split across manual, simulated, and webhook channels.
          </Typography>
        </Stack>

        {loading ? (
          <Stack spacing={1.5}>
            <Skeleton height={42} />
            <Skeleton height={42} />
            <Skeleton height={42} />
          </Stack>
        ) : sources.length === 0 ? (
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#f8fafc" }}>
            <Typography variant="body2" color="text.secondary">
              No alert source data yet. Simulate alerts to populate this panel.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {sources.map((source) => {
              const percentage = total
                ? Math.round((source.count / total) * 100)
                : 0;

              return (
                <Box key={source.source_type}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.75,
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 900,
                        color: "#0f172a",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {source.source_type}
                    </Typography>

                    <Chip
                      size="small"
                      label={`${source.count} alerts`}
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 999,
                        backgroundColor: "#f1f5f9",
                        color: "#334155",
                        "& .MuiChip-label": {
                          px: 0.8,
                        },
                      }}
                    />
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 7,
                      borderRadius: 999,
                      backgroundColor: "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#059669",
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertSourcesCard;