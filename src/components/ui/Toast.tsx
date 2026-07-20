"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, description?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description, duration }]);
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (title: string, description?: string, duration?: number) =>
        addToast("success", title, description, duration),
      error: (title: string, description?: string, duration?: number) =>
        addToast("error", title, description, duration),
      warning: (title: string, description?: string, duration?: number) =>
        addToast("warning", title, description, duration),
      info: (title: string, description?: string, duration?: number) =>
        addToast("info", title, description, duration),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Container for managing stacks of toasts
function ToastContainer({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual Toast Card
function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const { id, type, title, description, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const config = {
    success: {
      icon: CheckCircle,
      bg: "bg-[#091e14]/90",
      border: "border-green-500/30 focus:border-green-500/50",
      text: "text-green-400",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      bar: "bg-green-500",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-[#240c0f]/90",
      border: "border-red-500/30 focus:border-red-500/50",
      text: "text-red-400",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
      bar: "bg-red-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-[#251805]/90",
      border: "border-amber-500/30 focus:border-amber-500/50",
      text: "text-amber-400",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      bar: "bg-amber-500",
    },
    info: {
      icon: Info,
      bg: "bg-[#09152b]/90",
      border: "border-blue-500/30 focus:border-blue-500/50",
      text: "text-blue-400",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      bar: "bg-blue-500",
    },
  }[type];

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${config.bg} ${config.border} ${config.glow}`}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-semibold text-white leading-tight">{title}</h4>
        {description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        className="text-gray-500 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar timer animation */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-0.5 ${config.bar}`}
      />
    </motion.div>
  );
}
