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
    success: 'bg-white/95 dark:bg-slate-900/95 border-emerald-500/50 shadow-emerald-500/10',
    error: 'bg-white/95 dark:bg-slate-900/95 border-red-500/50 shadow-red-500/10',
    info: 'bg-white/95 dark:bg-slate-900/95 border-blue-500/50 shadow-blue-500/10',
    warning: 'bg-white/95 dark:bg-slate-900/95 border-amber-500/50 shadow-amber-500/10'
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border-2 backdrop-blur-xl shadow-2xl ${bgColors[type]} min-w-[320px] max-w-md`}
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
