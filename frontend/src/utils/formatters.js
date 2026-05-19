export const formatDateTime = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};

export const getConfidenceLabel = (confidence) => {
  if (confidence === null || confidence === undefined) return "N/A";

  const numericConfidence = Number(confidence);

  if (Number.isNaN(numericConfidence)) return "N/A";

  if (numericConfidence <= 1) {
    return `${Math.round(numericConfidence * 100)}%`;
  }

  return `${Math.round(numericConfidence)}%`;
};

export const safeText = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};