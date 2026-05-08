import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '@/context/ToastContext';

// Render portals inline so RTL can query them
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, createPortal: (node) => node };
});

// Skip framer-motion animations so elements are removed synchronously
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // eslint-disable-next-line no-unused-vars
      const { initial, animate, exit, transition, layout, ...rest } = props;
      return React.createElement('div', rest, children);
    },
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
}));

function ToastTrigger({ type, message }) {
  const toast = useToast();
  return (
    <button onClick={() => toast[type](message)} data-testid="trigger">
      Fire
    </button>
  );
}

function renderWithToast(type, message) {
  return render(
    <ToastProvider>
      <ToastTrigger type={type} message={message} />
    </ToastProvider>
  );
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a success toast', () => {
    renderWithToast('success', 'Saved successfully');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    renderWithToast('error', 'Something went wrong');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows a warning toast', () => {
    renderWithToast('warning', 'Check your input');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Check your input')).toBeInTheDocument();
  });

  it('shows an info toast', () => {
    renderWithToast('info', 'FYI: update available');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('FYI: update available')).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', () => {
    renderWithToast('success', 'Dismiss me');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after 3 seconds', () => {
    renderWithToast('info', 'Auto gone');
    fireEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Auto gone')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(screen.queryByText('Auto gone')).not.toBeInTheDocument();
  });
});
