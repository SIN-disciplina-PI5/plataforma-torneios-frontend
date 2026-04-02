import type { Level, Tab, Tournament } from "../_types";

export const TABS: Tab[] = ["Todos", "Essa semana", "Favoritos"];

export const LEVEL_COLORS: Record<Level, string> = {
  Avançado:      "text-orange-400",
  Intermediário: "text-green-400",
  Básico:        "text-sky-400",
};

// 🔴 MOCK — substituir por chamada real ao GET /torneios quando disponível
export const MOCK_TOURNAMENTS: Tournament[] = [
  { id: 1, title: "Torneio de Verão", level: "Avançado",      spots: 28, status: "Ativo",    favorite: true  },
  { id: 2, title: "Torneio de Verão", level: "Avançado",      spots: 28, status: "Ativo",    favorite: false },
  { id: 3, title: "Torneio de Verão", level: "Intermediário", spots: 28, status: "Esgotado", favorite: true  },
  { id: 4, title: "Torneio de Verão", level: "Avançado",      spots: 28, status: "Ativo",    favorite: true  },
  { id: 5, title: "Torneio de Verão", level: "Básico",        spots: 28, status: "Ativo",    favorite: true  },
  { id: 6, title: "Torneio de Verão", level: "Intermediário", spots: 28, status: "Esgotado", favorite: true  },
  { id: 7, title: "Torneio de Verão", level: "Avançado",      spots: 28, status: "Ativo",    favorite: false },
  { id: 8, title: "Torneio de Verão", level: "Básico",        spots: 28, status: "Ativo",    favorite: true  },
  { id: 9, title: "Torneio de Verão", level: "Intermediário", spots: 28, status: "Esgotado", favorite: false },
];