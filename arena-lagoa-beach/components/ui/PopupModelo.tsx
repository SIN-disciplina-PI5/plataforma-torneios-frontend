"use client";

import React, { ReactNode } from "react";
import { Check, X, CircleAlert } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error";
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function PopupModelo({
  isOpen,
  onClose,
  type = "success",
  title,
  description,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isSuccess ? (
              <Check className="text-green-600" size={28} />
            ) : (
              <CircleAlert className="text-red-600" size={28} />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-center text-sm text-gray-500 mt-2">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        {/* Footer */}
        <div className="mt-6">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className={`w-full text-white font-medium py-2.5 rounded-lg transition ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
