import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    error: 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20',
    info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-xl shadow-black/5 min-w-[320px] max-w-md ${bgColors[type]}`}
      >
        <div className="shrink-0">{icons[type]}</div>
        <p className="flex-1 text-sm font-bold text-slate-800 dark:text-slate-100">{message}</p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={16} className="text-slate-400" />
        </button>
      </motion.div>
    </div>
  );
};
