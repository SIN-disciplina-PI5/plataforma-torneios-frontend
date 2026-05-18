export interface Tournament {
  id_torneio: string;
  nome: string;
  categoria: string;
  vagas: number;
  status: boolean;
}

export interface TournamentUI extends Tournament {
  favorite: boolean;
}


export interface TournamentResponse {
  id_torneio: string;
  nome: string;
  categoria: string;
  vagas: number;
  status: boolean;
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