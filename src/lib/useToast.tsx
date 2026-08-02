"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  leaving: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);

      // After 3s, mark it as leaving (triggers slide-out animation)
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        // After the slide-out animation finishes (0.35s), remove it
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
      }, 3000);
    },
    []
  );

  const colors: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-gray-800",
  };

  const toastUI = (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(120%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(120%); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: "4.5rem",
          right: "1rem",
          zIndex: 2147483647,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white text-sm px-4 py-2.5 rounded-lg shadow-lg`}
            style={{
              animation: t.leaving
                ? "toast-out 0.35s cubic-bezier(0.4, 0, 1, 1) forwards"
                : "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && createPortal(toastUI, document.body)}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}