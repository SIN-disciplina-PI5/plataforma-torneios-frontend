import type { CreateInscricaoResponse, Tournament } from "../_types";
import { apiFetch } from "./http";

export async function registerForTournament(
  id_torneio: string,
  id_equipe: number
): Promise<CreateInscricaoResponse> {
  return apiFetch<CreateInscricaoResponse>("/inscricoes", {
    method: "POST",
    body: JSON.stringify({ id_equipe, id_torneio }),
  });
}

export async function fetchTournaments(): Promise<Tournament[]> {
  // Tipagem baseada no JSON real que você enviou
  const data = await apiFetch<{ 
    id_torneio: string; 
    nome: string; 
    categoria: string; 
    vagas: number; 
    status: boolean; // Backend envia true/false
  }[]>("/torneio");

  return data.map((t) => ({
    id: t.id_torneio,
    title: t.nome,
    level: t.categoria,
    spots: t.vagas,
    status: t.status, // Simplificado para boolean
    favorite: false,
  }));
}