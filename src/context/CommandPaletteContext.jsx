'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const CommandPaletteContext = createContext({});

export function CommandPaletteProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, close]);

  // Auto-focus the input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle, inputRef }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export const useCommandPalette = () => useContext(CommandPaletteContext);
