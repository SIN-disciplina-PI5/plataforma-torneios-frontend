"use client";

import { Zap } from "lucide-react";
import { Ranking } from "@/app/types/ranking";

interface RankingCardProps {
  ranking: Ranking;
  position: number;
}

const MEDAL_COLORS = {
  1: "from-yellow-400 to-yellow-500",
  2: "from-gray-300 to-gray-400",
  3: "from-orange-300 to-orange-400",
};

const MEDAL_ICONS = {
  1: "👑",
  2: "🥈",
  3: "🥉",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getPatenteColor(
  patente: string
): "bg-blue-100 text-blue-700" | "bg-purple-100 text-purple-700" | "bg-green-100 text-green-700" | "bg-amber-100 text-amber-700" {
  const patenteNorm = patente.toLowerCase();

  if (patenteNorm.includes("iniciante")) return "bg-blue-100 text-blue-700";
  if (patenteNorm.includes("intermediário") || patenteNorm.includes("intermediario"))
    return "bg-purple-100 text-purple-700";
  if (patenteNorm.includes("avançado") || patenteNorm.includes("avancado"))
    return "bg-green-100 text-green-700";

  return "bg-amber-100 text-amber-700";
}

export function RankingCard({ ranking, position }: RankingCardProps) {
  const isTopThree = position <= 3;
  const initials = getInitials(ranking.usuario.nome);
  const patenteColor = getPatenteColor(ranking.usuario.patente);

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl transition-all
        ${
          isTopThree
            ? `bg-gradient-to-r from-green-50 to-amber-50 border-2 border-green-200 shadow-md hover:shadow-lg`
            : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        }
      `}
    >
      {/* Posição com Medal */}
      <div className="flex items-center gap-3 min-w-fit">
        <div className="relative">
          {isTopThree ? (
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${MEDAL_COLORS[position as 1 | 2 | 3]} flex items-center justify-center text-lg font-bold text-white shadow-md`}>
              {position}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
              {position}
            </div>
          )}
        </div>

        {/* Avatar com Iniciais */}
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm
            ${
              isTopThree
                ? "bg-gradient-to-br from-green-500 to-green-600 shadow-md"
                : "bg-gray-300"
            }
          `}
        >
          {initials}
        </div>

        {/* Info do Usuário */}
        <div className="flex flex-col gap-1 min-w-fit">
          <p className={`font-bold ${isTopThree ? "text-gray-900" : "text-gray-800"} text-sm`}>
            {ranking.usuario.nome}
          </p>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 w-fit ${patenteColor}`}>
            {ranking.usuario.patente}
          </span>
        </div>
      </div>

      {/* Pontuação à Direita */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1.5 ${isTopThree ? "text-green-700" : "text-green-600"}`}>
            <span className="font-bold text-lg">{ranking.pontos_acumulados}</span>
            <Zap size={16} className="fill-current" />
          </div>
          <span className="text-xs text-gray-400">pontos</span>
        </div>

        {/* Medal Icon para Top 3 */}
        {isTopThree && (
          <div className="text-2xl ml-2">
            {MEDAL_ICONS[position as 1 | 2 | 3]}
          </div>
        )}
      </div>
    </div>
  );
}
