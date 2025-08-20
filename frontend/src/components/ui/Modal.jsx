import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fadeInScale">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          {actions}
        </div>
      </div>
    </div>
  );
};

export default Modal;
