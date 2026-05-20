"use client";

import { NotificacaoProvider } from "@/lib/NotificacaoContext";
import { ToastNotificacao } from "@/components/ui/ToastNotificacao";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificacaoProvider>
      {children}
      <ToastNotificacao /> 
    </NotificacaoProvider>
  );
}