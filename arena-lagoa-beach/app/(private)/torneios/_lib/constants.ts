// No seu arquivo _lib/constants.ts
import type { Tab } from "../_types";

export const TABS: Tab[] = ["Todos", "Essa semana", "Favoritos"];

export const LEVEL_COLORS: Record<string, string> = {
  "Avançado": "text-orange-400",
  "Intermediário": "text-green-400",
  "Iniciante": "text-sky-400"
};
