import { Box, Card, CardContent, Divider, LinearProgress, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { getConfidenceLabel, safeText } from "../../utils/formatters";

function InsightBlock({ title, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
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
  const progressValue = numericConfidence <= 1 ? numericConfidence * 100 : numericConfidence;

  return (
    <Card
      sx={{
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 3,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoAwesomeOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h6">AI Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Rule-based and history-aware incident recommendation
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
            CONFIDENCE
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Number.isNaN(progressValue) ? 0 : Math.min(progressValue, 100)}
              sx={{
                flex: 1,
                height: 9,
                borderRadius: 99,
              }}
            />

            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {getConfidenceLabel(confidence)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <InsightBlock title="SUMMARY" value={aiAnalysis?.summary} />
        <InsightBlock title="ROOT CAUSE" value={aiAnalysis?.root_cause} />
        <InsightBlock title="RECOMMENDATION" value={aiAnalysis?.recommendation} />
        <InsightBlock title="RECURRENCE INSIGHT" value={aiAnalysis?.recurrence_insight} />
        <InsightBlock title="PRIORITY REASON" value={aiAnalysis?.priority_reason} />
      </CardContent>
    </Card>
  );
}

export default AIInsightCard;