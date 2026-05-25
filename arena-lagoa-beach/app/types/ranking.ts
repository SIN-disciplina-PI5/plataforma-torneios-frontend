export interface Usuario {
  id: string;
  nome: string;
  patente: string;
}

export interface Ranking {
  posicao: number;
  pontos: number;
  ultima_atualizacao: string;
  usuario: Usuario;
}

export interface RankingResponse {
  results: number;
  data: Ranking[];
}