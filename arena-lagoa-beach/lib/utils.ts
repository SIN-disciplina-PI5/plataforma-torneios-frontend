import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return null;

  const datePart = dateString.split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return null;

  return `${day}/${month}/${year}`;
}
