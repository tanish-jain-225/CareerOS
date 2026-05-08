import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/page';
import { useData } from '@/context/DataContext';
import { useCollection } from '@/hooks/useDatabase';
import { useToast } from '@/context/ToastContext';

// Mock the hooks
vi.mock('@/lib/firebase', () => ({
  auth: { currentUser: { uid: 'test-uid' } },
  db: {},
  app: {},
}));
vi.mock('@/context/DataContext');
vi.mock('@/hooks/useDatabase');
vi.mock('@/context/ToastContext');
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', email: 'test@example.com' }, loading: false }),
}));
vi.mock('@/components/auth/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>,
}));

describe('DashboardPage', () => {
  const mockData = {
    jobs: { data: [{ id: '1', status: 'applied', appliedDate: new Date().toISOString() }] },
    outreach: { data: [{ id: '1', status: 'Replied' }] },
    profile: { data: { name: 'Test User' } },
  };

  const mockCollection = {
    data: [],
    addData: vi.fn(),
    updateData: vi.fn(),
    deleteData: vi.fn(),
  };

  beforeEach(() => {
    useData.mockReturnValue(mockData);
    useCollection.mockReturnValue(mockCollection);
    useToast.mockReturnValue({ success: vi.fn(), error: vi.fn() });
  });

  it('renders the dashboard with user name', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-title')).toHaveTextContent(/Test/i);
  });

  it('displays correct metrics', () => {
    render(<DashboardPage />);
    // Active Pipeline value
    expect(screen.getByText('Active Pipeline')).toBeDefined();
    // Since mockData has 1 applied job
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('renders stats grid', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Active Pipeline')).toBeDefined();
    expect(screen.getByText('Pending Syncs')).toBeDefined();
    expect(screen.getByText('Active Interviews')).toBeDefined();
    expect(screen.getByText('Offers Secured')).toBeDefined();
  });
});
