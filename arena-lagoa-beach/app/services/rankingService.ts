import { api } from "./api";
import { RankingResponse } from "@/app/types/ranking";

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
  } catch (error: any) {
    console.error("Erro na API:", error.response?.data || error.message);
    return null;
  }
};
