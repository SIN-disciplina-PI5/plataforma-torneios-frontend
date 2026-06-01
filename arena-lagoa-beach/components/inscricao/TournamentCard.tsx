import Image from "next/image";
import { Star, Users } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";
import { formatDate } from "@/lib/utils";
import styles from "@/app/(private)/torneios/_styles/tournaments.module.css";

const LEVEL_IMAGES: Record<string, string> = {
  Avançado: "/avancado3.png",
  Intermediário: "/intermediario3.png",
  Básico: "/iniciante3.png",
  Iniciante: "/iniciante3.png",
  default: "/cup.png",
};

const LEVEL_COLORS: Record<string, string> = {
  Avançado: "text-orange-400",
  Intermediário: "text-green-400",
  Iniciante: "text-sky-400",
  Básico: "text-sky-400",
};

const TURNO_LABELS: Record<string, string> = {
  MANHA: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
};

interface TournamentCardProps {
  tournament: TournamentUI;
  onToggleFavorite: (id: string) => void;
  onRegister: (tournament: TournamentUI) => void;
  onUnregister: (tournament: TournamentUI) => void;
  onVerDuplas: (tournament: TournamentUI) => void;
}

export function TournamentCard({
  tournament,
  onToggleFavorite,
  onRegister,
  onUnregister,
  onVerDuplas,
}: TournamentCardProps) {
  const isEsgotado = !tournament.status || tournament.vagas <= 0;

  return (
    <article
      className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col",
        styles.card
      )}
    >
      <div className="relative h-36 overflow-hidden bg-neutral-200">
        <Image
          src={LEVEL_IMAGES[tournament.categoria] || LEVEL_IMAGES.default}
          alt={`Torneio ${tournament.categoria}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              "text-xs font-semibold",
              LEVEL_COLORS[tournament.categoria] || "text-gray-400"
            )}
          >
            {tournament.categoria}
          </span>

          <div className="flex flex-col items-center gap-2">
            <button onClick={() => onToggleFavorite(tournament.id_torneio)}>
              <Star
                size={16}
                className={clsx(
                  "transition-colors",
                  tournament.favorite
                    ? "fill-green-600 stroke-green-600"
                    : "fill-transparent stroke-gray-400 hover:stroke-gray-600"
                )}
              />
            </button>

            <button
              onClick={() => onVerDuplas(tournament)}
              title="Ver duplas"
            >
              <Users
                size={16}
                className="stroke-gray-400 hover:stroke-gray-600 transition-colors"
              />
            </button>
          </div>
        </div>

        <p className="font-bold text-gray-900 text-sm leading-tight">
          {tournament.nome}
        </p>

        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Início:</span>{" "}
          {formatDate(tournament.data_inicio) ?? "Não informado"}
          <span className="mx-2 text-gray-200">|</span>
          <span className="font-medium text-gray-700">Fim:</span>{" "}
          {formatDate(tournament.data_fim) ?? "Não informado"}
        </p>

        <p className="text-xs text-gray-500">
          {tournament.vagas} vagas
          <span className="mx-2 text-gray-200">|</span>
          {TURNO_LABELS[tournament.turno] || tournament.turno}
          <span className="mx-2 text-gray-200">|</span>
          <span
            className={clsx(
              "font-medium",
              isEsgotado ? "text-red-500" : "text-green-600"
            )}
          >
            {isEsgotado ? "Esgotado" : "Disponível"}
          </span>
        </p>

        <div className="mt-auto">
          {isEsgotado ? (
            <button
              disabled
              className="rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white cursor-not-allowed opacity-90"
            >
              Esgotado
            </button>
          ) : tournament.jaInscrito ? (
            <button
              onClick={() => onUnregister(tournament)}
              className="rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              Desinscrever
            </button>
          ) : (
            <button
              onClick={() => onRegister(tournament)}
              className="rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              Se inscrever
            </button>
          )}
        </div>
      </div>
    </article>
  );
}