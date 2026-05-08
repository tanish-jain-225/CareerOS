import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PipelinePage from '@/app/jobs/page';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';

// Mock hooks
vi.mock('@/lib/firebase', () => ({
  auth: { currentUser: { uid: 'test-uid' } },
  db: {},
  app: {},
}));
vi.mock('@/context/DataContext');
vi.mock('@/context/ToastContext');
vi.mock('@/context/ModalContext');
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', email: 'test@example.com' }, loading: false }),
}));
vi.mock('@/components/auth/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>,
}));

describe('PipelinePage', () => {
  const mockJobs = {
    data: [
      {
        id: '1',
        company: 'Google',
        role: 'Engineer',
        status: 'applied',
        appliedDate: '2026-05-08',
      },
      { id: '2', company: 'Meta', role: 'Dev', status: 'sourced', appliedDate: '2026-05-07' },
    ],
    loading: false,
    error: null,
    addData: vi.fn(),
    updateData: vi.fn(),
    deleteData: vi.fn(),
  };

  beforeEach(() => {
    useData.mockReturnValue({ jobs: mockJobs });
    useToast.mockReturnValue({ success: vi.fn() });
    useModal.mockReturnValue({ openModal: vi.fn(), closeModal: vi.fn() });
  });

  it('renders the infiltration hub title', () => {
    render(<PipelinePage />);
    expect(screen.getByRole('heading', { name: /Infiltration Hub/i })).toBeDefined();
  });

  it('filters jobs based on search query', () => {
    render(<PipelinePage />);
    const searchInput = screen.getByPlaceholderText(/Search pipeline.../i);

    fireEvent.change(searchInput, { target: { value: 'Google' } });

    expect(screen.getByText('Google')).toBeDefined();
    expect(screen.queryByText('Meta')).toBeNull();
  });

  it('opens modal when New Target is clicked', () => {
    const { openModal } = useModal();
    render(<PipelinePage />);

    const newTargetBtn = screen.getByTestId('jobs-new-target');
    fireEvent.click(newTargetBtn);

    expect(openModal).toHaveBeenCalled();
  });

  it('displays job cards', () => {
    render(<PipelinePage />);
    expect(screen.getAllByText('Google').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Meta').length).toBeGreaterThan(0);
  });
});
