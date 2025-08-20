import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "../../context/ToastContext";

const colorByType = {
  success: "border-l-4 border-green-500 bg-green-50 text-green-800",
  error: "border-l-4 border-red-500 bg-red-50 text-red-800",
  warning: "border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800",
  info: "border-l-4 border-blue-500 bg-blue-50 text-blue-800",
};

const ToastViewport = () => {
  const { toasts, remove } = useToast();

  // Auto-dismiss after 5s
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), t.duration || 5000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, remove]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative rounded-xl shadow-md p-4 pr-10 animate-slideIn ${colorByType[t.type] || colorByType.info}`}
        >
          {/* Close Button */}
          <button
            onClick={() => remove(t.id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Title & Message */}
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          {t.message && <div className="text-sm">{t.message}</div>}
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
