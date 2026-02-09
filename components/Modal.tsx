"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-glow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="modal-title" className="text-xl font-semibold text-text">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-textMuted transition-colors hover:bg-surfaceLight hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <div className="mt-4 text-textMuted">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
