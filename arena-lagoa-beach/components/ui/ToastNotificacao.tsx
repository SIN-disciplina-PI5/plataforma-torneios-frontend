"use client";

import { useEffect } from "react";
import { useNotificacao } from "@/lib/NotificacaoContext";

export function ToastNotificacao() {
  const { toast, limparToast } = useNotificacao();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      limparToast();
    }, 3500); 

    return () => clearTimeout(timer);
  }, [toast, limparToast]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div className="bg-white border border-green-500 rounded-xl p-4 min-w-[320px]">
        <div className="font-semibold text-green-700">{toast.titulo}</div>
        <div className="text-sm text-gray-600 mt-1">{toast.mensagem}</div>
      </div>
    </div>
  );
}