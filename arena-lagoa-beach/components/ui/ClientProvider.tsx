"use client";

import { NotificacaoProvider } from "@/lib/NotificacaoContext";

export function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificacaoProvider>
      {children}
    </NotificacaoProvider>
  );
}