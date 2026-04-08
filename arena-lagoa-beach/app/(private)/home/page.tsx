"use client";

import { useEffect, useState } from "react";
import { CardPartida } from "./components/CardPartida";
import { TabsFase } from "./components/TabsFase";
import { getPartidasHome } from "@/app/services/homeService";
import { Partida } from "@/app/types/partida";

export default function Home() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPartidas() {
      try {
        const dados = await getPartidasHome();
        setPartidas(dados);
      } catch (error) {
        console.error("Erro ao buscar partidas do back-end:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPartidas();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Carregando suas partidas...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <span className="text-3xl">⚽</span>
        <h1 className="text-2xl font-bold text-gray-900">Olá, Márcio</h1>
      </div>

      <TabsFase />

      <div className="space-y-10">
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-4 px-1">
            Minhas Inscrições
          </h2>
          <div className="flex flex-col gap-3">
            {partidas.length > 0 ? (
              partidas.map((p) => (
                <CardPartida
                  key={p.id}
                  player1={p.equipe1.nome}
                  flag1={p.equipe1.bandeira}
                  score={p.placar}
                  player2={p.equipe2.nome}
                  flag2={p.equipe2.bandeira}
                  time={p.horario}
                  fase={p.fase}
                  isFavorite={p.isFavorito}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                Você ainda não tem partidas agendadas.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
