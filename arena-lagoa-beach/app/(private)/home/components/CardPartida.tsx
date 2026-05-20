import { Info, Star } from "lucide-react";

interface CardPartidaProps {
  player1: string;
  flag1: string;
  score: string;
  player2: string;
  flag2: string;
  time: string;
  fase: string;
  isFavorite?: boolean;
}

export function CardPartida({ 
  player1, flag1, score, player2, flag2, time, fase, isFavorite 
}: CardPartidaProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Player 1 */}
      <div className="flex items-center gap-3 w-1/3">
        <span className="text-xl">{flag1}</span>
        <span className="text-sm font-semibold text-gray-700">{player1}</span>
      </div>

      {/* Centro: Placar e Fase */}
      <div className="flex flex-col items-center gap-1">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          {score}
        </span>
        <span className="text-[10px] text-gray-400 font-medium uppercase">{fase}</span>
      </div>

      {/* Player 2 */}
      <div className="flex items-center gap-3 w-1/3 justify-end pr-4 lg:pr-10">
        <span className="text-sm font-semibold text-gray-700">{player2}</span>
        <span className="text-xl">{flag2}</span>
      </div>

      {/* Ações e Hora */}
      <div className="flex items-center gap-4">
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-lg text-sm font-bold">
          {time}
        </span>
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={18} className="cursor-pointer hover:text-gray-600" />
          <Star 
            size={18} 
            className={`cursor-pointer ${isFavorite ? "fill-green-900 text-green-900" : "hover:text-gray-600"}`} 
          />
        </div>
      </div>
    </div>
  );
}