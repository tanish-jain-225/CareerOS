import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

let authState = { user: null, loading: false };

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('@/components/ui/LogoLoader', () => ({
  default: () => React.createElement('div', null, 'Loading View'),
}));

vi.mock('@/components/auth/Auth', () => ({
  default: () => React.createElement('div', null, 'Auth View'),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState = { user: null, loading: false };
  });

  it('renders loader while auth is resolving', () => {
    authState = { user: null, loading: true };
    render(
      React.createElement(ProtectedRoute, null, React.createElement('div', null, 'Secure Content'))
    );
    expect(screen.getByText('Loading View')).toBeInTheDocument();
  });

  it('renders auth when no user', () => {
    authState = { user: null, loading: false };
    render(
      React.createElement(ProtectedRoute, null, React.createElement('div', null, 'Secure Content'))
    );
    expect(screen.getByText('Auth View')).toBeInTheDocument();
  });

  it('renders children for authenticated user', () => {
    authState = { user: { uid: 'abc' }, loading: false };
    render(
      React.createElement(ProtectedRoute, null, React.createElement('div', null, 'Secure Content'))
    );
    expect(screen.getByText('Secure Content')).toBeInTheDocument();
  });
});
