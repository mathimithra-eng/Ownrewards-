/**
 * Format a number as Indian currency
 * e.g. 12500 → "₹12,500"
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/**
 * Format reward points with comma separator
 * e.g. 12850 → "12,850 pts"
 */
export const formatPoints = (points: number): string => {
  return `${points.toLocaleString("en-IN")} pts`;
};

/**
 * Format a date string to a readable format
 * e.g. "2024-06-12T10:00:00Z" → "12 Jun 2024"
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format a date as short month/year
 * e.g. "Jan 2024"
 */
export const formatMonthYear = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

/**
 * Returns relative time string
 * e.g. "2 hours ago", "3 days ago"
 */
export const timeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(dateStr);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

/**
 * Get days remaining until a date
 * Returns negative if expired
 */
export const daysUntil = (dateStr: string): number => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Capitalize first letter of each word
 */
export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, maxLen: number): string => {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
};

/**
 * Get membership color
 */
export const getMembershipColor = (membership: string): string => {
  switch (membership?.toLowerCase()) {
    case "gold":
      return "#8b5cf6";
    case "platinum":
      return "#94a3b8";
    case "silver":
    default:
      return "#64748b";
  }
};

/**
 * Get initials from a full name
 * e.g. "R. Mathi Mithra" → "RM"
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter((n) => n.length > 1 && !n.endsWith("."))
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
