import { describe, it, expect, vi } from 'vitest';
import {
  formatBytes,
  addBusinessDays,
  getDaysDifference,
  getFollowUpStatus,
  formatDate,
  getWeekNumber,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1048576)).toBe('1.0 MB');
      expect(formatBytes(2097152)).toBe('2.0 MB');
    });
  });

  describe('addBusinessDays', () => {
    it('adds business days correctly (skipping weekends)', () => {
      // Friday (2026-05-08)
      const start = new Date('2026-05-08');
      const result = addBusinessDays(start, 1);
      // Should be Monday (2026-05-11)
      expect(result.getDay()).toBe(1);
      expect(result.getDate()).toBe(11);
    });

    it('adds multiple business days correctly', () => {
      const start = new Date('2026-05-08');
      const result = addBusinessDays(start, 3);
      // Wed (2026-05-13)
      expect(result.getDate()).toBe(13);
    });
  });

  describe('getDaysDifference', () => {
    it('calculates absolute difference in days', () => {
      const d1 = '2026-05-01';
      const d2 = '2026-05-05';
      expect(getDaysDifference(d1, d2)).toBe(4);
    });
  });

  describe('getFollowUpStatus', () => {
    it('returns null for non-applied status', () => {
      expect(getFollowUpStatus({ status: 'draft' })).toBeNull();
    });

    it('returns null if recently applied', () => {
      const now = new Date('2026-05-08');
      vi.useFakeTimers();
      vi.setSystemTime(now);

      const job = { appliedDate: '2026-05-07', status: 'applied' };
      expect(getFollowUpStatus(job)).toBeNull();

      vi.useRealTimers();
    });

    it('returns urgent status after 3 business days', () => {
      const now = new Date('2026-05-14'); // Thursday
      vi.useFakeTimers();
      vi.setSystemTime(now);

      // Applied Friday (May 8)
      // 3 business days: Mon, Tue, Wed (May 11, 12, 13)
      const job = { appliedDate: '2026-05-08', status: 'applied' };
      const status = getFollowUpStatus(job);
      expect(status.level).toBe('urgent');

      vi.useRealTimers();
    });
  });

  describe('formatDate', () => {
    it('formats date correctly for current year', () => {
      const now = new Date();
      const date = `${now.getFullYear()}-05-08`;
      expect(formatDate(date)).toBe('8 May');
    });

    it('formats date correctly for previous year', () => {
      expect(formatDate('2025-05-08')).toBe('8 May 2025');
    });
  });

  describe('getWeekNumber', () => {
    it('calculates week number correctly', () => {
      const date = new Date('2026-01-01');
      expect(getWeekNumber(date)).toBe(1);
    });
  });
});
