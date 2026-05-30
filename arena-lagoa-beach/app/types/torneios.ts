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
  | "registrations";

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

export type UserInscriptionResponse =
  InscricaoResponse;