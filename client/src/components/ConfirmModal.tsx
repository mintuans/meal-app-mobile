import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning'
}: ConfirmModalProps) => {
  const colors = {
    danger: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
  };

  const btnColors = {
    danger: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
    info: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`size-16 rounded-2xl flex items-center justify-center mb-6 ${colors[type]}`}>
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12 rounded-xl border-slate-100 dark:border-slate-800 font-bold"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`flex-1 h-12 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 ${btnColors[type]}`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
