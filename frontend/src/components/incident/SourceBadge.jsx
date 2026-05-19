import { Chip } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function SourceBadge({ sourceType }) {
  const normalizedSource = String(sourceType || "MANUAL").toUpperCase();

  const isAuto = normalizedSource === "AUTO";

  return (
    <Chip
      size="small"
      icon={isAuto ? <AutoAwesomeOutlinedIcon /> : <PersonOutlineOutlinedIcon />}
      label={isAuto ? "AUTO" : "MANUAL"}
      color={isAuto ? "secondary" : "default"}
      variant={isAuto ? "filled" : "outlined"}
    />
  );
}

export default SourceBadge;