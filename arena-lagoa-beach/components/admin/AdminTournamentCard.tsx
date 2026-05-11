import Image from "next/image";
import { Pencil, Trash2, Users } from "lucide-react";
import { clsx } from "clsx";

import type { Tournament } from "../../app/(private)/admin/torneios/_types";
import { LEVEL_COLORS } from "../../app/(private)/admin/torneios/_lib/constants";
import styles from "./AdminTournamentCard.module.css";

const LEVEL_IMAGES: Record<string, string> = {
  Avançado: "/avancado.png",
  Intermediário: "/intermediario.png",
  Básico: "/basico.png",
  Iniciante: "/basico.png",
  default: "/cup.png",
};

interface AdminTournamentCardProps {
  tournament: Tournament;
  onEdit: (tournament: Tournament) => void;
  onDelete: (tournament: Tournament) => void;
  onViewRegistrations: (tournament: Tournament) => void;
}

export function AdminTournamentCard({
  tournament,
  onEdit,
  onDelete,
  onViewRegistrations,
}: AdminTournamentCardProps) {
  const isEsgotado = !tournament.status || tournament.spots <= 0;

  return (
    <article className={clsx("bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col", styles.card)}>
      {/* Imagem */}
      <div className="relative h-36 overflow-hidden bg-neutral-200">
        <Image
          src={LEVEL_IMAGES[tournament.level] || LEVEL_IMAGES.default}
          alt={`Torneio ${tournament.level}`}
          fill
          className="object-contain"
        />
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        {/* Nível + Ações admin */}
        <div className="flex items-center justify-between">
          <span className={clsx("text-xs font-semibold", LEVEL_COLORS[tournament.level] || "text-gray-400")}>
            {tournament.level}
          </span>

          <div className="flex items-center gap-1">
            {/* Editar */}
            <button
              onClick={() => onEdit(tournament)}
              className={styles.actionBtn}
              aria-label="Editar torneio"
            >
              <Pencil size={14} />
            </button>

            {/* Deletar */}
            <button
              onClick={() => onDelete(tournament)}
              className={clsx(styles.actionBtn, styles.deleteBtn)}
              aria-label="Deletar torneio"
            >
              <Trash2 size={14} />
            </button>

            {/* Ver inscrições */}
            <button
              onClick={() => onViewRegistrations(tournament)}
              className={styles.actionBtn}
              aria-label="Ver inscrições"
            >
              <Users size={14} />
            </button>
          </div>
        </div>

        {/* Título */}
        <p className="font-bold text-gray-900 text-sm leading-tight">{tournament.title}</p>

        {/* Meta info */}
        <p className="text-xs text-gray-500 flex flex-wrap items-center gap-1">
          <span>{tournament.spots} vagas</span>
          <span className="text-gray-200 mx-1" aria-hidden="true">|</span>
          <span className={clsx("font-medium", isEsgotado ? "text-red-500" : "text-green-600")}>
            {isEsgotado ? "Esgotado" : "Ativo"}
          </span>
          {tournament.phase && (
            <>
              <span className="text-gray-200 mx-1" aria-hidden="true">|</span>
              <span className="text-gray-500">{tournament.phase}</span>
            </>
          )}
        </p>

        {/* Datas (se disponíveis) */}
        {tournament.startDate && tournament.endDate && (
          <p className="text-xs text-gray-400">
            {new Date(tournament.startDate).toLocaleDateString("pt-BR")} →{" "}
            {new Date(tournament.endDate).toLocaleDateString("pt-BR")}
          </p>
        )}

        {/* Status badge */}
        {isEsgotado ? (
          <span className="mt-auto self-start rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white">
            Esgotado
          </span>
        ) : (
          <span className="mt-auto self-start rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white">
            Se inscrever
          </span>
        )}
      </div>
    </article>
  );
}