'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ModalContext = createContext({});

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  // modal: { content, title, size }

  const openModal = useCallback((content, options = {}) => {
    setModal({ content, ...options });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {modal && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="modal-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
                  onClick={closeModal}
                />
                {/* Panel */}
                <motion.div
                  key="modal-panel"
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className={`fixed top-1/2 left-1/2 z-[9999] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 ${
                    modal.size === 'lg'
                      ? 'md:max-w-2xl'
                      : modal.size === 'sm'
                        ? 'md:max-w-sm'
                        : 'md:max-w-lg'
                  } max-h-[85vh] overflow-y-auto`}
                >
                  <div className="rounded-[28px] border border-white/10 bg-[#0c0c0f] shadow-2xl shadow-black/60">
                    {modal.title && (
                      <div className="flex items-center justify-between border-b border-white/5 px-7 pt-7 pb-5">
                        <h3 className="font-outfit text-base font-bold text-white">
                          {modal.title}
                        </h3>
                        <button
                          onClick={closeModal}
                          className="rounded-xl p-2 text-white/20 transition-all hover:bg-white/5 hover:text-white/60"
                          aria-label="Close modal"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {!modal.title && (
                      <button
                        onClick={closeModal}
                        className="absolute top-5 right-5 z-10 rounded-xl p-2 text-white/20 transition-all hover:bg-white/5 hover:text-white/60"
                        aria-label="Close modal"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <div className={modal.title ? 'p-7 pt-6' : 'p-7'}>{modal.content}</div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
