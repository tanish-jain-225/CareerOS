/**
 * Date and Time utilities for CareerOS
 */

/**
 * Formats a number of bytes into a human-readable string.
 * @param {number} bytes - The number of bytes to format.
 * @returns {string} Formatted string (e.g. "1.5 MB").
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/**
 * Adds a specified number of business days (skipping Sat/Sun) to a date.
 * @param {Date|string} date - Start date.
 * @param {number} days - Number of business days to add.
 * @returns {Date} Resulting date.
 */
export function addBusinessDays(date, days) {
  const d = new Date(date);
  let count = 0;
  while (count < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
  }
  return d;
}

/**
 * Calculates the absolute difference in days between two dates.
 * @param {Date|string} d1 - First date.
 * @param {Date|string} d2 - Second date (defaults to now).
 * @returns {number} Difference in days.
 */
export function getDaysDifference(d1, d2 = new Date()) {
  const diffTime = Math.abs(new Date(d2) - new Date(d1));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines the follow-up urgency level for a job application.
 * @param {Object} job - Job application record.
 * @returns {Object|null} Follow-up status object or null.
 */
export function getFollowUpStatus(job) {
  if (!job.appliedDate || !['applied', 'followed_up'].includes(job.status)) return null;
  const applied = new Date(job.appliedDate);
  const now = new Date();
  const firstFollowUp = addBusinessDays(applied, 3);
  const secondFollowUp = addBusinessDays(firstFollowUp, 7);
  
  if (now >= secondFollowUp) {
    return { level: 'critical', label: '2nd follow-up overdue', days: getDaysDifference(secondFollowUp, now) };
  }
  if (now >= firstFollowUp) {
    return { level: 'urgent', label: 'Follow-up required', days: getDaysDifference(firstFollowUp, now) };
  }
  return null;
}

/**
 * Calculates the current position in a standard outreach cadence (17-day cycle).
 * @param {string} createdAt - Date the outreach sequence started.
 * @returns {Object} Cadence status and next suggested action.
 */
export function getCadenceStatus(createdAt) {
  if (!createdAt) return { label: 'Day 0 — Init', nextAction: 'Send Intro', overdue: false, daysIn: 0, progress: 0 };
  const days = getDaysDifference(createdAt);
  
  if (days < 3) return { label: `Day ${days}`, nextAction: `Follow-up in ${3 - days}d`, overdue: false, daysIn: days, progress: (days / 17) * 100 };
  if (days < 10) return { label: `Day ${days} — F1`, nextAction: `Send Follow-up`, overdue: days > 5, daysIn: days, progress: (days / 17) * 100 };
  if (days < 17) return { label: `Day ${days} — F2`, nextAction: 'Final Outreach', overdue: days > 12, daysIn: days, progress: (days / 17) * 100 };
  return { label: `Day ${days} — Closed`, nextAction: 'Archive Node', overdue: true, daysIn: days, progress: 100 };
}

/**
 * Formats a date string into a tactical format ("DD Mon YYYY" or "DD Mon").
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  if (d.getFullYear() !== now.getFullYear()) {
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function getWeekNumber(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
