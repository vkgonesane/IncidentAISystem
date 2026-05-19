import { Chip } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

function DuplicateBadge({ duplicateCount }) {
  const count = Number(duplicateCount || 0);

  if (count <= 0) {
    return (
      <Chip
        size="small"
        label="No duplicates"
        variant="outlined"
      />
    );
  }

  return (
    <Chip
      size="small"
      icon={<ContentCopyOutlinedIcon />}
      label={`${count} duplicate${count > 1 ? "s" : ""}`}
      color="warning"
      variant="outlined"
    />
  );
}

export default DuplicateBadge;