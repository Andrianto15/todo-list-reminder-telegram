'use client';

import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  isDestructive = true,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 p-3.5 rounded-lg text-amber-900 dark:text-amber-200">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 min-h-[44px] text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-border transition"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2.5 min-h-[44px] text-xs font-semibold text-white rounded-lg transition shadow-xs ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#4682b4] hover:bg-[#36648b]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
