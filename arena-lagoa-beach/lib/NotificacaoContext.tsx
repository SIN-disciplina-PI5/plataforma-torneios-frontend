"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { api } from "@/app/services/api";
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
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  atualizarUnreadCount: () => Promise<void>;
};

const NotificacaoContext = createContext<
  NotificacaoContextType | undefined
>(undefined);

export const NotificacaoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const atualizarUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const notificacoes: Notificacao[] = response.data || [];
      const naoLidas = notificacoes.filter(
        (n) => !n.lida
      ).length;

      setUnreadCount(naoLidas);
    } catch (error) {
      console.error(
        "Erro ao carregar contagem de notificações:",
        error
      );
    }
  };

  useEffect(() => {
    atualizarUnreadCount();
  }, []);

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
        unreadCount,
        setUnreadCount,
        atualizarUnreadCount,
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