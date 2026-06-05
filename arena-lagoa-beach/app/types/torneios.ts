export interface Tournament {
  id_torneio: string;
  nome: string;
  categoria: string;
  vagas: number;
  status: boolean;
  data_inicio?: string;
  data_fim?: string;
  turno: "MANHA" | "TARDE" | "NOITE";
}

export interface TournamentUI extends Tournament {
  favorite: boolean;
  jaInscrito?: boolean;
  id_inscricao?: string | null;
}

export interface TournamentResponse {
  id_torneio: string;
  nome: string;
  categoria: string;
  vagas: number;
  status: boolean;
  turno: "MANHA" | "TARDE" | "NOITE";
}

export interface InscricaoResponse {
  id_inscricao: string;
  id_usuario: number;
  id_torneio: string;
  status: boolean;
  data_inscricao: string;
}

export interface CreateInscricaoResponse {
  message: string;
  data: {
    id: number;
    id_equipe: number;
    id_torneio: string;
    status: "AGUARDANDO" | "APROVADA" | "REJEITADA";
    createdAt: string;
    updatedAt: string;
  };
}

export type AdminDialogState =
  | "idle"
  | "confirmDelete"
  | "loadingDelete"
  | "successDelete"
  | "errorDelete"
  | "edit"
  | "create"
  | "registrations"
  | "generatingMatches"
  | "generateMatches"
  | "errorGenerateMatches";

export type TorneioCriacaoErrorType =
  | "duplicate-name"
  | "invalid-token"
  | "expired-token"
  | "forbidden"
  | "validation-error"
  | "generic-error";

export interface TorneioCriacaoError {
  type: TorneioCriacaoErrorType;
  mensagem: string;
  statusCode?: number;
}

export interface TorneioCriacaoResponse {
  sucesso: boolean;
  erro?: TorneioCriacaoError;
  dados?: Tournament;
}

export interface GerarChaveResponse {
  sucesso: boolean;
  mensagem?: string;
  totalPartidas?: number;
}

export type UserInscriptionResponse = InscricaoResponse;

// ─── helpers de status do torneio ────────────────────────────────────────────

/**
 * Quantos dias faltam até data_inicio (negativo = já passou).
 * Retorna null se data_inicio não estiver definida.
 */
export function diasParaInicio(torneio: Tournament): number | null {
  if (!torneio.data_inicio) return null;
  const agora = new Date();
  const inicio = new Date(torneio.data_inicio);
  const diff = inicio.getTime() - agora.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * O torneio já começou (data_inicio no passado).
 */
export function torneioJaIniciou(torneio: Tournament): boolean {
  const dias = diasParaInicio(torneio);
  if (dias === null) return false;
  return dias < 0;
}

/**
 * Edição está bloqueada: faltam 2 dias ou menos para o início.
 * (inscrição e troca de dupla ficam desabilitadas)
 */
export function edicaoBloqueada(torneio: Tournament): boolean {
  const dias = diasParaInicio(torneio);
  if (dias === null) return false;
  return dias <= 2;
}

/**
 * Aviso de "faltam 3 dias": exibir banner de alerta de encerramento de edição.
 * Intervalo: entre 2 e 3 dias restantes (inclusive).
 */
export function exibirAvisoFechamentoProximo(torneio: Tournament): boolean {
  const dias = diasParaInicio(torneio);
  if (dias === null) return false;
  return dias === 3;
}