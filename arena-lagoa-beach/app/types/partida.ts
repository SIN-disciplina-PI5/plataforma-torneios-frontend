export interface Equipe {
  nome: string;
  bandeira: string;
  id_usuario: string;
}

export interface Partida {
  id_partida: string;
  fase: string;
  horario: string;
  placar: string | null;
  Torneio: {
    nome: string;
  };
  equipe1: Equipe;
  equipe2: Equipe;
  favorita?: boolean;
}

export interface GrupoDePartidas {
  dataLabel: string;
  partidas: Partida[];
}
