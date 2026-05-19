"use client";

import { useEffect, useState } from "react";
import { Ranking } from "@/app/types/ranking";
import { getRankingGeral } from "@/app/services/rankingService";
import { RankingCard } from "@/components/ranking/RankingCard";
import { TrophyRanking } from "@/components/icons/TrophyRanking";
import { AlertCircle } from "lucide-react";

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRankingGeral();

        if (!response) {
          setError("Falha ao carregar o ranking");
          setRankings([]);
          return;
        }

        if (response.data) {
          setRankings(response.data);
        } else {
          setError("Nenhum dado de ranking disponível");
          setRankings([]);
        }
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError("Erro ao carregar o ranking");
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-sans p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 mb-1 text-black">
          🏆 Ranking Geral
        </h1>
        <p className="text-[#a1a1aa] text-sm font-medium">
          Confira a posição dos melhores jogadores da plataforma
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && rankings.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#a1a1aa] font-medium text-sm">Nenhum ranking disponível</p>
        </div>
      )}

      {/* Rankings List */}
      {rankings.length > 0 && (
        <div className="space-y-2">
          {rankings.map((ranking) => (
            <RankingCard
              key={ranking.usuario.id}
              ranking={ranking}
              position={ranking.posicao}
            />
          ))}
        </div>
      )}
    </div>
  );
}
