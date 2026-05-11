import type { Tournament } from "../_types";
import { apiFetch } from "../../../../(private)/torneios/_lib/http";

type GetTorneiosResponse = {
  data: {
    id_torneio: string;
    nome: string;
    categoria: string;
    vagas: number;
    status: boolean;
  }[];
};

export async function fetchTournaments(): Promise<Tournament[]> {
  const response = await apiFetch<GetTorneiosResponse>("/torneio");

  if (!Array.isArray(response.data)) {
    return [];
  }

  return response.data.map((t) => ({
    id: t.id_torneio,
    title: t.nome,
    level: t.categoria,
    spots: t.vagas,
    status: t.status,
  }));
}

export async function deleteTournament(id: string): Promise<void> {
  await apiFetch(`/torneio/${id}`, { method: "DELETE" });
}