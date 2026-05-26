import {
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import { getConfidenceLabel, safeText } from "../../utils/formatters";

function InsightBlock({ title, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 800 }}
      >
        {title}
      </Typography>

      <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>
        {safeText(value)}
      </Typography>
    </Box>
  );
}

function AIInsightCard({ aiAnalysis }) {
  const confidence = aiAnalysis?.confidence;
  const numericConfidence = Number(confidence || 0);
  const progressValue =
    numericConfidence <= 1 ? numericConfidence * 100 : numericConfidence;

  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: "#f1f5f9",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PsychologyAltOutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              AI Root Cause Analysis
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Incident-level RCA, recommendation, and priority reasoning
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 800 }}
          >
            CONFIDENCE
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Number.isNaN(progressValue) ? 0 : Math.min(progressValue, 100)}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 99,
                backgroundColor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#059669",
                },
              }}
            />

            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {getConfidenceLabel(confidence)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "grid", gap: 2 }}>
          <InsightBlock title="ROOT CAUSE" value={aiAnalysis?.root_cause} />
          <InsightBlock title="RECOMMENDATION" value={aiAnalysis?.recommendation} />
          <InsightBlock title="SUMMARY" value={aiAnalysis?.summary} />
          <InsightBlock title="RECURRENCE INSIGHT" value={aiAnalysis?.recurrence_insight} />
          <InsightBlock title="PRIORITY REASON" value={aiAnalysis?.priority_reason} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default AIInsightCard;