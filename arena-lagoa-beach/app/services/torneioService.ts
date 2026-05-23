import { api } from "./api";
import type { Tournament, TournamentUI, CreateInscricaoResponse } from "@/app/types/torneios";
import axios from "axios";

interface TorneiosApiResponse {
  data: Tournament[];
}

interface CreateTorneioRequest {
  nome: string;
  categoria: string;
  vagas: number;
  data_inicio: string;
  data_fim: string;
}

interface CreateTorneioResponse {
  message: string;
  data: Tournament;
}

export const getTorneios = async (): Promise<TournamentUI[] | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.get<TorneiosApiResponse>("/torneio", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.map((t) => ({ ...t, favorite: false }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na API:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return null;
  }
};

export const createTorneio = async (
  torneioData: CreateTorneioRequest
): Promise<Tournament | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.post<CreateTorneioResponse>(
      "/torneios",
      torneioData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao criar torneio:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return null;
  }
};

export const deleteTorneio = async (id_torneio: string): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    await api.delete(`/torneio/${id_torneio}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao deletar:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return false;
  }
};

export const registerForTournament = async (
  id_torneio: string,
  id_equipe: number
): Promise<CreateInscricaoResponse | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.post<CreateInscricaoResponse>(
      "/inscricoes",
      { id_equipe, id_torneio },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na API:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return null;
  }
};