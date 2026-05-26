import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

function LatestAIInsightCard({ incidents = [], loading = false }) {
  const latestWithAI = incidents.find((incident) => incident.ai_analysis);

  return (
    <Card sx={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoAwesomeOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Latest AI Prediction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Most recent AI root cause and recommendation.
            </Typography>
          </Box>
        </Stack>

        {loading ? (
          <Stack spacing={1}>
            <Skeleton height={32} />
            <Skeleton height={70} />
            <Skeleton height={50} />
          </Stack>
        ) : !latestWithAI ? (
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#f8fafc" }}>
            <Typography variant="body2" color="text.secondary">
              No AI prediction available yet. Create or simulate an incident.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={`#${latestWithAI.id}`} />
              <Chip size="small" color="success" label={latestWithAI.vendor} />
              <Chip size="small" label={latestWithAI.severity} />
            </Stack>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                ROOT CAUSE
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                {latestWithAI.ai_analysis.root_cause}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                RECOMMENDATION
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {latestWithAI.ai_analysis.recommendation}
              </Typography>
            </Box>

            <Chip
              size="small"
              color="success"
              label={`Confidence: ${Math.round(Number(latestWithAI.ai_analysis.confidence || 0) * 100)}%`}
              sx={{ width: "fit-content", fontWeight: 700 }}
            />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default LatestAIInsightCard;