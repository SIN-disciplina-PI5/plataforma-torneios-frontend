"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type Notificacao = {
  id_notificacao: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
};

type NotificacaoContextType = {
  toast: Notificacao | null;
  mostrarToast: (notificacao: Notificacao) => void;
  limparToast: () => void;
};

const NotificacaoContext = createContext<NotificacaoContextType | undefined>(
  undefined
);

export const NotificacaoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [toast, setToast] = useState<Notificacao | null>(null);

  const mostrarToast = (notificacao: Notificacao) => {
    setToast(notificacao);
  };

  const limparToast = () => {
    setToast(null);
  };

  return (
    <NotificacaoContext.Provider
      value={{
        toast,
        mostrarToast,
        limparToast,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
};

export const useNotificacao = () => {
  const context = useContext(NotificacaoContext);
  if (context === undefined) {
    throw new Error("useNotificacao must be used within a NotificacaoProvider");
  }
  return context;
};