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
        <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-100 p-3.5 rounded-2xl text-amber-900">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-medium text-white rounded-xl transition shadow-sm ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
