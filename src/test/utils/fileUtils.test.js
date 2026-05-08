import { describe, it, expect } from 'vitest';
import { detectCategory, VAULT_CATEGORIES, CATEGORY_STYLES } from '@/utils/fileUtils';

describe('fileUtils', () => {
  describe('detectCategory', () => {
    it('detects Resume from filename containing "resume"', () => {
      expect(detectCategory('my_resume_2026.pdf')).toBe('Resume');
    });

    it('detects Resume from filename containing "cv"', () => {
      expect(detectCategory('John_CV.pdf')).toBe('Resume');
    });

    it('detects Cover Letter from filename containing "cover"', () => {
      expect(detectCategory('cover_letter_google.docx')).toBe('Cover Letter');
    });

    it('defaults to Credential for unrecognised filenames', () => {
      expect(detectCategory('certificate_aws.pdf')).toBe('Credential');
      expect(detectCategory('transcript.pdf')).toBe('Credential');
      expect(detectCategory('')).toBe('Credential');
    });

    it('is case-insensitive', () => {
      expect(detectCategory('RESUME.pdf')).toBe('Resume');
      expect(detectCategory('Cover_Letter.pdf')).toBe('Cover Letter');
    });
  });

  describe('VAULT_CATEGORIES', () => {
    it('contains All, Resume, Cover Letter, Credential', () => {
      expect(VAULT_CATEGORIES).toEqual(['All', 'Resume', 'Cover Letter', 'Credential']);
    });
  });

  describe('CATEGORY_STYLES', () => {
    it('maps Resume to indigo', () => {
      expect(CATEGORY_STYLES['Resume']).toBe('indigo');
    });

    it('maps Cover Letter to blue', () => {
      expect(CATEGORY_STYLES['Cover Letter']).toBe('blue');
    });

    it('maps Credential to emerald', () => {
      expect(CATEGORY_STYLES['Credential']).toBe('emerald');
    });
  });
});
