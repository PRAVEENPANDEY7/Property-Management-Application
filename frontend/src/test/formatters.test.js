import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, getImageUrl, truncateText } from '../utils';

describe('Utility Formatters', () => {
  it('should format numbers into localized USD currency', () => {
    expect(formatCurrency(1250000)).toBe('$1,250,000.00');
    expect(formatCurrency('450000.5')).toBe('$450,000.50');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(null)).toBe('$0.00');
    expect(formatCurrency(undefined)).toBe('$0.00');
  });

  it('should format valid ISO dates and handle invalid values', () => {
    const formatted = formatDate('2026-10-12T08:00:00Z');
    expect(formatted).toContain('2026');
    expect(formatDate(null)).toBe('N/A');
    expect(formatDate('invalid-date')).toBe('N/A');
  });

  it('should resolve safe relative image paths to streaming endpoints', () => {
    const url = getImageUrl('uploads/properties/sample-uuid.jpg');
    expect(url).toContain('/api/properties/images/sample-uuid.jpg');

    const bareFilename = getImageUrl('another-photo.png');
    expect(bareFilename).toContain('/api/properties/images/another-photo.png');

    const fallbackUrl = getImageUrl(null);
    expect(fallbackUrl).toContain('unsplash.com');
  });

  it('should truncate text at max length cleanly', () => {
    const long = 'This is a very long property description that should be truncated when it exceeds maximum allowed length.';
    const truncated = truncateText(long, 30);
    expect(truncated.length).toBeLessThanOrEqual(33); // 30 + '...'
    expect(truncated.endsWith('...')).toBe(true);

    const short = 'Short title';
    expect(truncateText(short, 30)).toBe('Short title');
  });
});
