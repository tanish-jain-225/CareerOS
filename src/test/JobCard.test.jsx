import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobCard from '@/components/features/jobs/JobCard';

// Mock dateUtils
vi.mock('@/utils/dateUtils', () => ({
  getFollowUpStatus: vi.fn(() => null),
}));

// Mock ModalContext — capture openModal calls
const mockOpenModal = vi.fn();
const mockCloseModal = vi.fn();
vi.mock('@/context/ModalContext', () => ({
  useModal: () => ({ openModal: mockOpenModal, closeModal: mockCloseModal }),
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
    qualityGate: { resume_mapped: true },
  };

  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job information correctly', () => {
    render(<JobCard job={mockJob} onUpdate={mockUpdate} onDelete={mockDelete} onEdit={mockEdit} />);

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('expands details when chevron is clicked', async () => {
    render(<JobCard job={mockJob} onUpdate={mockUpdate} onDelete={mockDelete} onEdit={mockEdit} />);

    const expandBtn = screen.getByRole('button', { name: /Expand details/i });
    fireEvent.click(expandBtn);

    expect(screen.getByText(/Testing notes/)).toBeInTheDocument();
  });

  it('opens confirm modal when delete button is clicked', () => {
    render(<JobCard job={mockJob} onUpdate={mockUpdate} onDelete={mockDelete} onEdit={mockEdit} />);

    const deleteBtn = screen.getByRole('button', { name: /Purge job entry/i });
    fireEvent.click(deleteBtn);

    // Should open modal instead of window.confirm
    expect(mockOpenModal).toHaveBeenCalled();
    // onDelete should NOT be called yet — waiting for modal confirmation
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
