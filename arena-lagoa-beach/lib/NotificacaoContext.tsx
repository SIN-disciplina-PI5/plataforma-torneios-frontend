"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "EQUIPE_CRIADA" | "ENTROU_EQUIPE" | "SAIU_EQUIPE" | "AVISO_SOZINHO";
  lida: boolean;
  createdAt: string;
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type NotificacaoContextType = {
  notificacoes: Notificacao[];
  toast: Notificacao | null;
  addNotificacao: (dados: Omit<Notificacao, "id" | "createdAt" | "lida">) => Promise<void>;
  marcarComoLida: (id: string) => Promise<void>;
  limparToast: () => void;
  carregando: boolean;
};

const NotificacaoContext = createContext({} as NotificacaoContextType);

export const NotificacaoProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [toast, setToast] = useState<Notificacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  const fetchNotificacoes = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await api.get("/notifications");
      setNotificacoes(response.data);
    } catch (error) {
      setNotificacoes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificacoes();
  }, [fetchNotificacoes]);

  const addNotificacao = async (dados: Omit<Notificacao, "id" | "createdAt" | "lida">) => {
    try {
      const response = await api.post("/notifications", dados);
      const novaNotificacao: Notificacao = response.data;
      setNotificacoes((prev) => [novaNotificacao, ...prev]);
      setToast(novaNotificacao);
      setTimeout(() => setToast(null), 4000);
    } catch (error) {
        console.error('Erro ao adicionar notificação:', error);
    }
  };

  const marcarComoLida = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const limparToast = () => setToast(null);

  return (
    <NotificacaoContext.Provider
      value={{
        notificacoes,
        toast,
        addNotificacao,
        marcarComoLida,
        limparToast,
        carregando,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
};

export const useNotificacao = () => useContext(NotificacaoContext);