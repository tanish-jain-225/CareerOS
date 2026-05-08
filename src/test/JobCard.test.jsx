import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobCard from '../components/JobCard';

// Mock dateUtils
vi.mock('../utils/dateUtils', () => ({
  getFollowUpStatus: vi.fn(() => null),
}));

describe('JobCard', () => {
  const mockJob = {
    id: '1',
    company: 'Google',
    role: 'Software Engineer',
    status: 'applied',
    excitement: 4,
    appliedDate: '2026-05-01',
    source: 'LinkedIn',
    notes: 'Testing notes',
    qualityGate: { resume_mapped: true }
  };

  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEdit = vi.fn();

  it('renders job information correctly', () => {
    render(
      <JobCard 
        job={mockJob} 
        onUpdate={mockUpdate} 
        onDelete={mockDelete} 
        onEdit={mockEdit} 
      />
    );

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('expands details when chevron is clicked', async () => {
    render(
      <JobCard 
        job={mockJob} 
        onUpdate={mockUpdate} 
        onDelete={mockDelete} 
        onEdit={mockEdit} 
      />
    );

    // Initial state: notes should not be visible (it's inside AnimatePresence/motion.div)
    // Actually, in JSDOM/RTL, it might be in the document but hidden.
    // Let's check for the chevron button.
    const expandBtn = screen.getByRole('button', { name: /Expand details/i });
    
    // For now, let's find it by the lucide icon name or index if needed.
    // But I'll just check if "Testing notes" appears after click.
    fireEvent.click(expandBtn);
    
    // AnimatePresence might need some wait or mock.
    // In JSDOM, it often renders immediately if animations are not mocked.
    expect(screen.getByText(/Testing notes/)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    window.confirm = vi.fn(() => true);
    render(
      <JobCard 
        job={mockJob} 
        onUpdate={mockUpdate} 
        onDelete={mockDelete} 
        onEdit={mockEdit} 
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /Purge job entry/i });
    fireEvent.click(deleteBtn);

    expect(mockDelete).toHaveBeenCalledWith('1');
  });
});
