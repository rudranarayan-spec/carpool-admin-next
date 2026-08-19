// components/ui/ConfirmModal.tsx
"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="bg-white dark:bg-[#12171F] border border-gray-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};