export interface Equipe {
  nome: string;
  bandeira: string;
}

export interface Partida {
  id_partida: string;
  fase: string;
  horario: string;
  placar: string | null;
  Torneio: {
    nome: string;
  };
}
