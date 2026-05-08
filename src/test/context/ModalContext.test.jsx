import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider, useModal } from '@/context/ModalContext';

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

function ModalTrigger({ title, content, size }) {
  const { openModal } = useModal();
  return (
    <button
      data-testid="open"
      onClick={() => openModal(<div data-testid="modal-content">{content}</div>, { title, size })}
    >
      Open
    </button>
  );
}

function renderWithModal(props = {}) {
  return render(
    <ModalProvider>
      <ModalTrigger {...props} />
    </ModalProvider>
  );
}

describe('ModalContext', () => {
  it('renders nothing initially', () => {
    renderWithModal({ content: 'Hello' });
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('opens modal with content when triggered', () => {
    renderWithModal({ content: 'Modal Body' });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('Modal Body')).toBeInTheDocument();
  });

  it('renders modal title when provided', () => {
    renderWithModal({ title: 'My Modal', content: 'Content' });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    renderWithModal({ title: 'Closeable', content: 'Close me' });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText('Close me')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(screen.queryByText('Close me')).not.toBeInTheDocument();
  });

  it('does not render modal content without title close button when no title', () => {
    renderWithModal({ content: 'No title modal' });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText('No title modal')).toBeInTheDocument();
    // Close button still exists (absolute positioned)
    expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
  });
});
