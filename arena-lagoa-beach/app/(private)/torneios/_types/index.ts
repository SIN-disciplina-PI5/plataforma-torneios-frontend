export type DialogState = "idle" | "confirm" | "loading" | "success" | "error";
export type Tab = "Todos" | "Essa semana" | "Favoritos";

// Status da inscrição (backend)
export type InscricaoStatus = "AGUARDANDO" | "APROVADA" | "REJEITADA";

export interface Inscricao {
  id: number;
  id_equipe: number;
  id_torneio: string;
  status: InscricaoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInscricaoResponse {
  message: string;
  data: Inscricao;
}

export interface ApiErrorResponse {
  error: string;
}

  export interface Tournament {
  id: string;          
  title: string;
  level: string;       
  spots: number;
  status: boolean;
  favorite: boolean;
}