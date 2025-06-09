import {
  parseISO,
  isSameDay,
  formatDistanceToNow,
  isThisWeek,
  format,
} from "date-fns";
export function formatRelativeTime(dateString) {
  const date = parseISO(dateString); // Convert ISO string to Date object
  const now = new Date();

  // Check if the date is today
  if (isSameDay(date, now)) {
    return formatDistanceToNow(date, { addSuffix: true }); // e.g., "3 hours ago"
  }

  // Check if the date is within this week
  if (isThisWeek(date)) {
    return format(date, "EEEE"); // e.g., "Last Friday"
  }

  // For older dates, return a formatted date string
  return format(date, "MMMM d, yyyy"); // e.g., "December 15, 2024"
}
