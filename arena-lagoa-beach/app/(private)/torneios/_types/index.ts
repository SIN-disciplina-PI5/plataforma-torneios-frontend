export type Level = "Avançado" | "Intermediário" | "Básico";
export type Status = "Ativo" | "Esgotado";
export type DialogState = "idle" | "confirm" | "loading" | "success" | "error";
export type Tab = "Todos" | "Essa semana" | "Favoritos";

// Status que vem do backend
export type InscricaoStatus = "AGUARDANDO" | "APROVADA" | "REJEITADA";

// Formato da inscrição retornada pelo backend
export interface Inscricao {
  id: number;
  id_equipe: number;
  id_torneio: number;
  status: InscricaoStatus;
  createdAt: string;
  updatedAt: string;
}

// Resposta do POST /inscricoes
export interface CreateInscricaoResponse {
  message: string;
  data: Inscricao;
}

// Resposta de erro do backend
export interface ApiErrorResponse {
  error: string;
}

// Modelo do torneio usado no front
//  Atualize os campos quando tiver o endpoint GET /torneios
export interface Tournament {
  id: number;
  title: string;
  level: Level;
  spots: number;
  status: Status;
  favorite: boolean;
}