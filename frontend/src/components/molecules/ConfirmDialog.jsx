import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../atoms';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isConfirming = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-surface-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onClose}
          disabled={isConfirming}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={variant}
          size="md"
          onClick={onConfirm}
          isLoading={isConfirming}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
