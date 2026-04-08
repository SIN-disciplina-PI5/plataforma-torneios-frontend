export interface Equipe {
  nome: string;
  bandeira: string;
}

export interface Partida {
  id: string | number;
  fase: string;
  data: string;
  horario: string;
  placar: string;
  equipe1: Equipe;
  equipe2: Equipe;
  isFavorito: boolean;
}
