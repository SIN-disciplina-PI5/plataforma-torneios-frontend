"use client";

import { useEffect, useState } from "react";
import { Ranking } from "@/app/types/ranking";
import { getRankingGeral } from "@/app/services/rankingService";
import { RankingCard } from "@/components/ranking/RankingCard";
import { AlertCircle, Trophy } from "lucide-react";

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

        if (response.success && response.data) {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-green-600" size={32} />
          <h1 className="text-4xl font-bold text-gray-900">Ranking Geral</h1>
        </div>
        <p className="text-gray-600 text-sm">
          Confira a posição dos melhores jogadores da plataforma
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && rankings.length === 0 && !error && (
        <div className="text-center py-12">
          <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 font-medium">Nenhum ranking disponível</p>
        </div>
      )}

      {/* Rankings List */}
      {rankings.length > 0 && (
        <div className="space-y-3">
          {rankings.map((ranking, index) => (
            <RankingCard
              key={ranking.id_ranking}
              ranking={ranking}
              position={ranking.posicao_atual}
            />
          ))}
        </div>
      )}
    </div>
  );
}