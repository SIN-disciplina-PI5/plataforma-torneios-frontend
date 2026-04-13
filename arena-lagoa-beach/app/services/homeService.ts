import { api } from "./api";
import { Partida } from "@/app/types/partida";

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
  } catch (error: any) {
    console.error("Erro na API:", error.response?.data || error.message);
    return [];
  }
};
