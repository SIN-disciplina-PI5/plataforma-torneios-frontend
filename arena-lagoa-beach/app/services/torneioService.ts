import { api } from "./api";
import type {
  Tournament,
  TournamentUI,
  CreateInscricaoResponse,
  TorneioCriacaoError,
  TorneioCriacaoResponse,
} from "@/app/types/torneios";
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.map((t) => ({
      ...t,
      favorite: false,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro na API:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro inesperado:", error);
    }

    return null;
  }
};

export const createTorneio = async (
  torneioData: CreateTorneioRequest
): Promise<TorneioCriacaoResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      sucesso: false,
      erro: {
        type: "invalid-token",
        mensagem: "Sua sessão expirou. Faça login novamente.",
        statusCode: 401,
      },
    };
  }

  try {
    const response = await api.post<CreateTorneioResponse>(
      "/torneio",
      torneioData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      sucesso: true,
      dados: response.data.data,
    };
  } catch (error: unknown) {
    const torneioError = mapearErroParaTorneioCriacao(error);

    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar torneio:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro inesperado:", error);
    }

    return {
      sucesso: false,
      erro: torneioError,
    };
  }
};

const mapearErroParaTorneioCriacao = (error: unknown): TorneioCriacaoError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const mensagemAPI = error.response?.data?.message;

    switch (status) {
      case 409:
        return {
          type: "duplicate-name",
          mensagem: "Já existe um torneio com esse nome.",
          statusCode: 409,
        };

      case 401:
        return {
          type: "invalid-token",
          mensagem: "Sua sessão expirou. Faça login novamente.",
          statusCode: 401,
        };

      case 403:
        return {
          type: "forbidden",
          mensagem: "Você não tem permissão para criar torneios.",
          statusCode: 403,
        };

      case 400:
        return {
          type: "validation-error",
          mensagem: mensagemAPI || "Dados inválidos. Verifique os campos.",
          statusCode: 400,
        };

      default:
        return {
          type: "generic-error",
          mensagem: "Erro ao criar torneio. Tente novamente.",
          statusCode: status,
        };
    }
  }

  return {
    type: "generic-error",
    mensagem: "Erro inesperado ao criar torneio. Tente novamente.",
  };
};

export const deleteTorneio = async (
  id_torneio: string
): Promise<boolean> => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    await api.delete(`/torneio/${id_torneio}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao deletar:",
        error.response?.data || error.message
      );
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
      {
        id_equipe,
        id_torneio,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro na API:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro inesperado:", error);
    }

    return null;
  }
};