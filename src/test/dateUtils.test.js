import { describe, it, expect, vi } from 'vitest';
import { addBusinessDays, getFollowUpStatus, getCadenceStatus } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('addBusinessDays', () => {
    it('adds business days correctly across a weekend', () => {
      // Friday, May 2, 2026
      const start = new Date('2026-05-02');
      const result = addBusinessDays(start, 3);
      // Expected: Monday (1), Tuesday (2), Wednesday (3) -> May 7?
      // Wait, let's check May 2, 2026 day of week.
      // 2026-05-02 is Saturday.
      // 2026-05-01 is Friday.
      // May 2 (Sat) -> May 4 (Mon, 1), May 5 (Tue, 2), May 6 (Wed, 3).
      expect(result.toISOString()).toContain('2026-05-06');
    });

    it('returns the same date if 0 days added', () => {
      const start = new Date('2026-05-01');
      const result = addBusinessDays(start, 0);
      expect(result.toISOString()).toContain('2026-05-01');
    });
  });

  describe('getFollowUpStatus', () => {
    it('returns null for "sourced" status', () => {
      const job = { status: 'sourced', appliedDate: '2026-05-01' };
      expect(getFollowUpStatus(job)).toBeNull();
    });

    it('returns null if no appliedDate', () => {
      const job = { status: 'applied' };
      expect(getFollowUpStatus(job)).toBeNull();
    });

    it('returns "Follow-up required" after 3 business days', () => {
      // Mock "now" to be 4 business days after application
      const applied = '2026-05-01'; // Friday
      // 3 business days later is Wednesday, May 6.
      // Let's mock "now" to May 7.
      const mockNow = new Date('2026-05-07');
      vi.useFakeTimers();
      vi.setSystemTime(mockNow);

      const job = { status: 'applied', appliedDate: applied };
      const status = getFollowUpStatus(job);
      expect(status.label).toBe('Follow-up required');
      expect(status.level).toBe('urgent');

      vi.useRealTimers();
    });
  });

  describe('getCadenceStatus', () => {
    it('returns initial state for new nodes', () => {
      const status = getCadenceStatus(null);
      expect(status.label).toContain('Init');
    });

    it('shows progress for active nodes', () => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 5);
      const status = getCadenceStatus(createdAt.toISOString());
      expect(status.daysIn).toBe(5);
      expect(status.progress).toBeGreaterThan(0);
    });
  });
});
