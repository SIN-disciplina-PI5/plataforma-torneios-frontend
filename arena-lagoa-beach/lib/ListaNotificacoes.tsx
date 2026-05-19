"use client";

import { useNotificacao } from "@/lib/NotificacaoContext";

export function ListaNotificacoes() {
  const { notificacoes, carregando, marcarComoLida } = useNotificacao();

  if (carregando) {
    return <div className="text-gray-500">Carregando notificações...</div>;
  }

  if (notificacoes.length === 0) {
    return <div className="text-gray-500">Nenhuma notificação ainda.</div>;
  }

  return (
    <div className="space-y-3">
      {notificacoes.map((n) => {
        const notificacaoId = n.id;
        return (
          <div
            key={notificacaoId}
            className={`bg-white rounded-xl p-3 shadow border cursor-pointer ${
              !n.lida ? "border-blue-400 bg-blue-50" : ""
            }`}
            onClick={() => !n.lida && marcarComoLida(notificacaoId)}
          >
            <div className="font-semibold">{n.titulo}</div>
            <div className="text-sm text-gray-600">{n.mensagem}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}