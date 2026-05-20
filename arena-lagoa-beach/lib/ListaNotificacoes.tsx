"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Notificacao = {
  id_notificacao: string;
  titulo: string;
  mensagem: string;
  tipo: string;
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

export function ListaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    try {
      const response = await api.get("/notifications");
      setNotificacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setCarregando(false);
    }
  };

  const marcarComoLida = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id_notificacao === id ? { ...n, lida: true } : n))
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  if (carregando) {
    return <div className="text-gray-500">Carregando notificações...</div>;
  }

  if (notificacoes.length === 0) {
    return <div className="text-gray-500">Nenhuma notificação ainda.</div>;
  }

  return (
    <div className="space-y-3">
      {notificacoes.map((n) => (
        <div
          key={n.id_notificacao}
          className={`bg-white rounded-xl p-3 shadow border cursor-pointer ${
            !n.lida ? "border-blue-400 bg-blue-50" : ""
          }`}
          onClick={() => !n.lida && marcarComoLida(n.id_notificacao)}
        >
          <div className="font-semibold">{n.titulo}</div>
          <div className="text-sm text-gray-600">{n.mensagem}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}