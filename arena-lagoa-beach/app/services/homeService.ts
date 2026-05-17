import { api } from "./api";
import { Partida } from "@/app/types/partida";

type ApiError = {
  response?: {
    data?: unknown;
  };
  message?: string;
};

function getApiError(error: unknown): ApiError {
  return error instanceof Error ? error : {};
}

export const getPartidasHome = async (): Promise<Partida[]> => {
  const token = localStorage.getItem("token");

  if (!token) return [];

  try {
    const response = await api.get<Partida[]>("/partidas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    const apiError = getApiError(error);
    console.error("Erro na API:", apiError.response?.data || apiError.message);
    return [];
  }
};
