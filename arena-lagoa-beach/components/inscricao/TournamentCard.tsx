import Image from "next/image";
import { Star } from "lucide-react";
import { clsx } from "clsx";

import type { Tournament, Level } from "../../app/(private)/torneios/_types";
import { LEVEL_COLORS } from "../../app/(private)/torneios/_lib/constants";
import styles from "../../app/(private)/torneios/_styles/tournaments.module.css";

const LEVEL_IMAGES: Record<Level, string> = {
  Avançado: "/avancado.png",
  Intermediário: "/intermediario.png",
  Básico: "/basico.png",
};

interface TournamentCardProps {
  tournament: Tournament;
  onToggleFavorite: (id: number) => void;
  onRegister: (tournament: Tournament) => void;
}

export function TournamentCard({ tournament, onToggleFavorite, onRegister }: TournamentCardProps) {
  const isEsgotado = tournament.status === "Esgotado";

  return (
    <article
      className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col w-[260px]",
        // ↑ MUDANÇA: largura fixa w-[260px], borda fica pelo styles.card abaixo
        styles.card,
      )}
    >
      <div className="relative h-36 overflow-hidden">
        <Image src={LEVEL_IMAGES[tournament.level]} alt={`Torneio ${tournament.level}`} fill className="object-cover" />
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className={clsx("text-xs font-semibold", LEVEL_COLORS[tournament.level])}>
            {tournament.level}
          </span>
          <button onClick={() => onToggleFavorite(tournament.id)} aria-label={tournament.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <Star size={16} className={clsx("transition-colors", tournament.favorite ? "fill-green-600 stroke-green-600" : "fill-transparent stroke-gray-300 hover:stroke-gray-500")} />
          </button>
        </div>

        <p className="font-bold text-gray-900 text-sm leading-tight">{tournament.title}</p>

        <p className="text-xs text-gray-500">
          {tournament.spots} vagas
          <span className="mx-2 text-gray-200" aria-hidden="true">|</span>
          <span className={clsx("font-medium", isEsgotado ? "text-red-500" : "text-green-600")}>{tournament.status}</span>
        </p>

        {isEsgotado ? (
          <button disabled className="mt-auto self-start rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white cursor-not-allowed opacity-90">Esgotado</button>
        ) : (
          <button onClick={() => onRegister(tournament)} className="mt-auto self-start rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-1.5 text-xs font-semibold text-white transition-colors">Se inscrever</button>
        )}
      </div>
    </article>
  );
}