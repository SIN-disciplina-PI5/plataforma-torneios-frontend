export type AdminDialogState =
  | "idle"
  | "confirmDelete"
  | "loadingDelete"
  | "successDelete"
  | "errorDelete"
  | "edit"
  | "create"
  | "registrations";

export type AdminTab =
  | "Todos"
  | "Essa semana"
  | "Oitavas de Finais"
  | "Quartas de Finais"
  | "Semifinais"
  | "Finais";

export interface Tournament {
  id: string;
  title: string;
  level: string;
  spots: number;
  status: boolean;
}