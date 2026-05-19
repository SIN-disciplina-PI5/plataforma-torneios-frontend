"use client";

import { Zap } from "lucide-react";
import { Ranking } from "@/app/types/ranking";

interface RankingCardProps {
  ranking: Ranking;
  position: number;
}


function getPatenteColor(
  patente: string
): {
  bg: string;
  text: string;
  label: string;
} {
  const patenteNorm = patente.toLowerCase();

  if (patenteNorm.includes("iniciante"))
    return { bg: "bg-blue-50", text: "text-blue-700", label: "Iniciante" };
  if (
    patenteNorm.includes("amador") ||
    patenteNorm.includes("intermediário") ||
    patenteNorm.includes("intermediario")
  )
    return { bg: "bg-amber-50", text: "text-amber-700", label: "Amador" };
  if (patenteNorm.includes("semi"))
    return { bg: "bg-purple-50", text: "text-purple-700", label: "Semi-Pro" };
  if (
    patenteNorm.includes("profissional") ||
    patenteNorm.includes("avançado") ||
    patenteNorm.includes("avancado")
  )
    return { bg: "bg-green-50", text: "text-green-700", label: "Profissional" };
  if (patenteNorm.includes("lenda"))
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      label: "Lenda",
    };

  return { bg: "bg-gray-50", text: "text-gray-700", label: patente };
}

export function RankingCard({ ranking, position }: RankingCardProps) {
  const isTopThree = position <= 3;
  const patenteInfo = getPatenteColor(ranking.usuario.patente);

  return (
    <>
      {/* Borda Gradiente - Wrapper (Top 3) ou Borda Cinza (Resto) */}
      {isTopThree ? (
        <div
          className="p-[3px] rounded-[12px] hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: "linear-gradient(90deg, #91D8FF 0%, #FFF200 100%)",
          }}
        >
          {/* Card Interior - Top 3 */}
          <div
            className="flex items-center justify-between px-6 py-3 rounded-[12px] bg-white transition-all duration-200 bg-gradient-to-r from-green-50/50 to-white"
            style={{
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* Esquerda: Posição + Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Posição */}
              <div className="shrink-0 w-8 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-black text-[#111827]">
                    {position}
                  </span>
                  <span className="text-xl">
                    {[null, "👑", "🥈", "🥉"][position]}
                  </span>
                </div>
              </div>

              {/* Info: Nome + Patente */}
              <div className="flex flex-col gap-2 min-w-0">
                <p className="font-bold text-[15px] text-[#111827] truncate">
                  {ranking.usuario.nome}
                </p>
                <span
                  className={`text-xs font-semibold rounded-full px-2.5 py-0.5 w-fit ${patenteInfo.bg} ${patenteInfo.text}`}
                >
                  {patenteInfo.label}
                </span>
              </div>
            </div>

            {/* Direita: Pontos */}
            <div className="shrink-0 flex flex-col items-end gap-1 ml-6">
              <div className="flex items-center gap-1.5 text-green-600">
                <span className="text-2xl font-black">{ranking.pontos}</span>
                <Zap size={18} className="fill-current" />
              </div>
              <span className="text-xs text-gray-400">pontos</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-[12px] hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
          {/* Card Interior - Normal */}
          <div
            className="flex items-center justify-between px-6 py-3 rounded-[12px] bg-white transition-all duration-200"
            style={{
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* Esquerda: Posição + Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Posição */}
              <div className="shrink-0 w-8 text-center">
                <span className="text-sm font-bold text-gray-600">
                  {position}
                </span>
              </div>

              {/* Info: Nome + Patente */}
              <div className="flex flex-col gap-2 min-w-0">
                <p className="font-bold text-[15px] text-[#111827] truncate">
                  {ranking.usuario.nome}
                </p>
                <span
                  className={`text-xs font-semibold rounded-full px-2.5 py-0.5 w-fit ${patenteInfo.bg} ${patenteInfo.text}`}
                >
                  {patenteInfo.label}
                </span>
              </div>
            </div>

            {/* Direita: Pontos */}
            <div className="shrink-0 flex flex-col items-end gap-1 ml-6">
              <div className="flex items-center gap-1.5 text-green-500">
                <span className="text-2xl font-black">{ranking.pontos}</span>
                <Zap size={18} className="fill-current" />
              </div>
              <span className="text-xs text-gray-400">pontos</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
