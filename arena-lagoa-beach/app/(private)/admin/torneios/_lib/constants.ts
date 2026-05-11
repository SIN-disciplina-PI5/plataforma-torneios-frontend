import type { AdminTab } from "../_types";

export const ADMIN_TABS: AdminTab[] = [
  "Todos",
  "Essa semana",
  "Oitavas de Finais",
  "Quartas de Finais",
  "Semifinais",
  "Finais",
];

export const LEVEL_COLORS: Record<string, string> = {
  Avançado: "text-orange-400",
  Intermediário: "text-green-400",
  Básico: "text-sky-400",
  Iniciante: "text-sky-400",
};