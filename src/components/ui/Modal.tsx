'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative bg-white dark:bg-slate-800 rounded-[5px] max-w-md w-full p-6 shadow-lg border border-[#ebebeb] dark:border-slate-700 space-y-4 z-10 text-[#404040] dark:text-slate-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-light text-[#404040] dark:text-slate-100">{title}</h3>
              <button
                onClick={onClose}
                className="text-[#737373] dark:text-slate-400 hover:text-[#404040] dark:hover:text-slate-200 rounded-[5px] p-1.5 hover:bg-[#ebebeb]/50 dark:hover:bg-slate-700 transition"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
