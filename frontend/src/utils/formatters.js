import { API_BASE_URL } from '../constants';

/**
 * Format a numeric price into a localized currency string.
 * @param {number|string} price
 * @returns {string}
 */
export function formatCurrency(price) {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price));
}

/**
 * Format an ISO date string into a user-friendly date format.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'N/A';
  }
}

/**
 * Resolve an image filename or relative path to a streaming API URL.
 * @param {string} filenameOrPath
 * @returns {string}
 */
export function getImageUrl(filenameOrPath) {
  if (!filenameOrPath) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  }

  // Extract base filename if a path like uploads/properties/xyz.jpg is passed
  const filename = filenameOrPath.includes('/') 
    ? filenameOrPath.split('/').pop() 
    : filenameOrPath.includes('\\') 
      ? filenameOrPath.split('\\').pop() 
      : filenameOrPath;

  const base = API_BASE_URL || '';
  return `${base}/api/properties/images/${encodeURIComponent(filename)}`;
}

/**
 * Truncate long text strings cleanly.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncateText(text, max = 120) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.substring(0, max).trim() + '...';
}
