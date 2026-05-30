"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";

import { notificacaoToast } from "@/components/ui/sonner";

export type Notificacao = {
  id_notificacao: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
};

type NotificacaoContextType = {
  mostrarToast: (notificacao: Notificacao) => void;
};

const NotificacaoContext = createContext<
  NotificacaoContextType | undefined
>(undefined);

export const NotificacaoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const mostrarToast = (notificacao: Notificacao) => {
    notificacaoToast({
      titulo: notificacao.titulo,
      mensagem: notificacao.mensagem,
      tipo:
        notificacao.tipo?.toLowerCase() as
          | "success"
          | "error"
          | "warning"
          | "info",
    });
  };

  return (
    <NotificacaoContext.Provider
      value={{
        mostrarToast,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
};

export const useNotificacao = () => {
  const context = useContext(NotificacaoContext);

  if (!context) {
    throw new Error(
      "useNotificacao must be used within NotificacaoProvider"
    );
  }

  return context;
};