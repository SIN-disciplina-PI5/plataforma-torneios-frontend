import { api } from "./api";
import { RankingResponse } from "@/app/types/ranking";

type ApiError = {
  response?: {
    data?: unknown;
  };
  message?: string;
};

function getApiError(error: unknown): ApiError {
  return error instanceof Error ? error : {};
}

export const getRankingGeral = async (): Promise<RankingResponse | null> => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await api.get<RankingResponse>("/ranking/geral", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    const apiError = getApiError(error);
    console.error("Erro na API:", apiError.response?.data || apiError.message);
    return null;
  }
};
