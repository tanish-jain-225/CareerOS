import { FileText, FileImage, FileSpreadsheet, FileArchive, FileCode } from 'lucide-react';
import React from 'react';

/**
 * Maps MIME types to appropriate Lucide icons.
 * @param {string} type - MIME type of the file.
 * @returns {JSX.Element} Icon component.
 */
export function getFileIcon(type) {
  if (type?.includes('pdf')) return <FileText size={20} />;
  if (type?.includes('image')) return <FileImage size={20} />;
  if (type?.includes('spreadsheet') || type?.includes('excel') || type?.includes('csv'))
    return <FileSpreadsheet size={20} />;
  if (type?.includes('zip') || type?.includes('rar') || type?.includes('archive'))
    return <FileArchive size={20} />;
  if (type?.includes('text') || type?.includes('doc') || type?.includes('code'))
    return <FileCode size={20} />;
  return <FileText size={20} />;
}

/**
 * Intelligent category detection based on file name.
 * @param {string} name - Name of the file.
 * @returns {string} Detected category.
 */
export function detectCategory(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('resume') || lower.includes('cv')) return 'Resume';
  if (lower.includes('cover')) return 'Cover Letter';
  return 'Credential';
}

/**
 * Styling map for file categories.
 */
export const CATEGORY_STYLES = {
  Resume: 'indigo',
  'Cover Letter': 'blue',
  Credential: 'emerald',
};

/**
 * Available file categories in the system.
 */
export const VAULT_CATEGORIES = ['All', 'Resume', 'Cover Letter', 'Credential'];
