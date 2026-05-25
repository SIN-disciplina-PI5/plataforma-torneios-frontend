import Image from "next/image";
import { Star } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";

const LEVEL_IMAGES: Record<string, string> = {
  Avançado: "/avancado2.png",
  Intermediário: "/intermediario2.png",
  Básico: "/iniciante.png",
  Iniciante: "/iniciante.png",
  default: "/cup.png",
};

const LEVEL_COLORS: Record<string, string> = {
  Avançado: "text-orange-400",
  Intermediário: "text-green-400",
  Iniciante: "text-sky-400",
  Básico: "text-sky-400",
};

interface TournamentCardProps {
  tournament: TournamentUI;
  onToggleFavorite: (id: string) => void;
  onRegister: (tournament: TournamentUI) => void;
}

export function TournamentCard({ tournament, onToggleFavorite, onRegister }: TournamentCardProps) {
  const isEsgotado = !tournament.status || tournament.vagas <= 0;

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col w-[300px]">
      <div className="relative h-36 overflow-hidden bg-neutral-200">
        <Image
          src={LEVEL_IMAGES[tournament.categoria] || LEVEL_IMAGES.default}
          alt={`Torneio ${tournament.categoria}`}
          fill
          className="object-cover" //"object-cover object-bottom" para quando consertar o tamanho, pra ficar igual a admin
        />
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className={clsx("text-xs font-semibold", LEVEL_COLORS[tournament.categoria] || "text-gray-400")}>
            {tournament.categoria}
          </span>
          <button
            onClick={() => onToggleFavorite(tournament.id_torneio)}
            aria-label={tournament.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star
              size={16}
              className={clsx(
                "transition-colors",
                tournament.favorite
                  ? "fill-green-600 stroke-green-600"
                  : "fill-transparent stroke-gray-300 hover:stroke-gray-500"
              )}
            />
          </button>
        </div>

        <p className="font-bold text-gray-900 text-sm leading-tight">{tournament.nome}</p>

        <p className="text-xs text-gray-500">
          {tournament.vagas} vagas
          <span className="mx-2 text-gray-200" aria-hidden="true">|</span>
          <span className={clsx("font-medium", isEsgotado ? "text-red-500" : "text-green-600")}>
            {isEsgotado ? "Esgotado" : "Disponível"}
          </span>
        </p>

        {isEsgotado ? (
          <button
            disabled
            className="mt-auto self-start rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white cursor-not-allowed opacity-90"
          >
            Esgotado
          </button>
        ) : (
          <button
            onClick={() => onRegister(tournament)}
            className="mt-auto self-start rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Se inscrever
          </button>
        )}
      </div>
    </article>
  );
}