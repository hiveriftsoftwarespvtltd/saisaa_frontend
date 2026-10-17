import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminModal } from './AdminModal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white border border-stone-200 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition-all ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#0A261C] hover:bg-[#123D2E]'
            }`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            danger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-5 h-5 stroke-[2]" />
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{message}</p>
      </div>
    </AdminModal>
  );
};
