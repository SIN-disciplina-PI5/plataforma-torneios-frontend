import type { CreateInscricaoResponse } from "../_types";
import { apiFetch } from "./http";

/**
 * POST /inscricoes
 * Cria uma inscrição para uma equipe em um torneio.
 * Requer autenticação (Bearer token no localStorage).
 *
 * @param id_torneio - ID do torneio selecionado
 * @param id_equipe  - ID da equipe do usuário logado
 */
export async function registerForTournament(
  id_torneio: number,
  id_equipe: number
): Promise<CreateInscricaoResponse> {
  return apiFetch<CreateInscricaoResponse>("/inscricoes", {
    method: "POST",
    body: JSON.stringify({ id_equipe, id_torneio }),
  });
}

// TODO: descomente quando o endpoint de torneios estiver disponível
// export async function fetchTournaments() {
//   return apiFetch("/torneios");
// }