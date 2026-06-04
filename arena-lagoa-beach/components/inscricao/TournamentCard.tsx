import Image from "next/image";
import { Star, Users } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";
import {
  torneioJaIniciou,
  edicaoBloqueada,
  exibirAvisoFechamentoProximo,
} from "@/app/types/torneios";
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

/** Retorna a flag de status que substitui "Disponível" na linha de meta-info */
function StatusFlag({ tournament }: { tournament: TournamentUI }) {
  const jaIniciou       = torneioJaIniciou(tournament);
  const bloqueado       = edicaoBloqueada(tournament);
  const avisoFechamento = exibirAvisoFechamentoProximo(tournament);
  const isEsgotado      = !tournament.status || tournament.vagas <= 0;

  if (jaIniciou) {
    return (
      <span className="font-medium text-blue-600 whitespace-nowrap">
         Em andamento
      </span>
    );
  }

  if (avisoFechamento) {
    return (
      <span className="font-medium text-amber-500 whitespace-nowrap">
         Fecha em 2 dias
      </span>
    );
  }

  if (bloqueado) {
    return (
      <span className="font-medium text-orange-500 whitespace-nowrap">
         Inscrições encerradas
      </span>
    );
  }

  if (isEsgotado) {
    return (
      <span className="font-medium text-red-500 whitespace-nowrap">
        Esgotado
      </span>
    );
  }

  return (
    <span className="font-medium text-green-600 whitespace-nowrap">
      Disponível
    </span>
  );
}

export function TournamentCard({
  tournament,
  onToggleFavorite,
  onRegister,
  onUnregister,
  onVerDuplas,
}: TournamentCardProps) {
  const isEsgotado      = !tournament.status || tournament.vagas <= 0;
  const jaIniciou       = torneioJaIniciou(tournament);
  const bloqueado       = edicaoBloqueada(tournament);
  const podeInscrever   = !isEsgotado && !jaIniciou && !bloqueado && !tournament.jaInscrito;
  const podeCancelar    = tournament.jaInscrito && !jaIniciou && !bloqueado;

  return (
    <article
      className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col w-full",
        styles.card,
      )}
    >
      {/* ── Imagem de capa (sem banner no topo) ─────────────────────────── */}
      <div className="relative h-32 sm:h-36 w-full bg-neutral-200">
        <Image
          src={LEVEL_IMAGES[tournament.categoria] || LEVEL_IMAGES.default}
          alt={`Torneio ${tournament.categoria}`}
          fill
          className="object-cover"
        />
      </div>

      {/* ── Corpo do card ────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={clsx(
              "text-xs font-semibold truncate",
              LEVEL_COLORS[tournament.categoria] || "text-gray-400",
            )}
            title={tournament.categoria}
          >
            {tournament.categoria}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(tournament.id_torneio)}
              className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Star
                size={16}
                className={clsx(
                  "transition-colors",
                  tournament.favorite
                    ? "fill-green-600 stroke-green-600"
                    : "fill-transparent stroke-gray-400 hover:stroke-gray-600",
                )}
              />
            </button>

            <button
              onClick={() => onVerDuplas(tournament)}
              title="Ver duplas"
              className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Users
                size={16}
                className="stroke-gray-400 hover:stroke-gray-600 transition-colors"
              />
            </button>
          </div>
        </div>

        <h3
          className="font-bold text-gray-900 text-sm leading-tight truncate w-full"
          title={tournament.nome}
        >
          {tournament.nome}
        </h3>

        {/* Meta info — flag de status substitui "Disponível" */}
        <div className="flex flex-col gap-1 w-full min-w-0 mt-1">
          <p className="text-xs text-gray-500 truncate w-full">
            <span className="font-medium text-gray-700">Início:</span>{" "}
            {formatDate(tournament.data_inicio) ?? "Não informado"}
            <span className="mx-1.5 text-gray-200">|</span>
            <span className="font-medium text-gray-700">Fim:</span>{" "}
            {formatDate(tournament.data_fim) ?? "Não informado"}
          </p>

          <p className="text-xs text-gray-500 truncate w-full">
            {tournament.vagas} vagas
            <span className="mx-1.5 text-gray-200">|</span>
            {TURNO_LABELS[tournament.turno] || tournament.turno}
            <span className="mx-1.5 text-gray-200">|</span>
            <StatusFlag tournament={tournament} />
          </p>
        </div>

        {/* ── Botões de ação ─────────────────────────────────────────────── */}
        <div className="mt-auto pt-3 flex flex-col gap-2">

          {/* Esgotado e não iniciado */}
          {isEsgotado && !jaIniciou && (
            <button
              disabled
              className="rounded-lg bg-red-500 w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white cursor-not-allowed opacity-90"
            >
              Esgotado
            </button>
          )}

          {/* Não inscrito */}
          {!isEsgotado && !tournament.jaInscrito && (
            <button
              onClick={() => podeInscrever && onRegister(tournament)}
              disabled={!podeInscrever}
              className={clsx(
                "rounded-lg w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white transition-colors",
                podeInscrever
                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed",
              )}
            >
              {jaIniciou
                ? "Torneio iniciado"
                : bloqueado
                ? "Inscrições encerradas"
                : "Se inscrever"}
            </button>
          )}

          {/* Inscrito: desinscrever */}
          {tournament.jaInscrito && (
            <button
              onClick={() => podeCancelar && onUnregister(tournament)}
              disabled={!podeCancelar}
              className={clsx(
                "rounded-lg w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white transition-colors",
                podeCancelar
                  ? "bg-red-500 hover:bg-red-600 active:bg-red-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed",
              )}
            >
              {jaIniciou
                ? "Cancelamento indisponível"
                : bloqueado
                ? "Cancelamento encerrado"
                : "Desinscrever"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}