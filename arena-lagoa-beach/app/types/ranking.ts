export interface Usuario {
  id_usuario: string;
  nome: string;
  patente: string;
  email: string;
}

export interface Ranking {
  id_ranking: string;
  id_usuario: string;
  pontos_acumulados: number;
  posicao_atual: number;
  ultima_atualizacao: string;
  createdAt: string;
  updatedAt: string;
  usuario: Usuario;
}

export interface RankingResponse {
  success: boolean;
  data: Ranking[];
  message: string;
}
