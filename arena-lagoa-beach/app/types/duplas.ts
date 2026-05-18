export type Player = {
  id: number;
  name: string;
};

export type Dupla = {
  id: number;
  players: [Player | null, Player | null];
};
