"use client";

import { useNotificacao } from "@/lib/NotificacaoContext";

export function ToastNotificacao() {
  const { toast, limparToast } = useNotificacao();

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 w-80 bg-white shadow-lg rounded-xl p-4 border z-50">
      <div className="font-bold">{toast.titulo}</div>
      <div className="text-sm text-gray-600">{toast.mensagem}</div>
    </div>
  );
}