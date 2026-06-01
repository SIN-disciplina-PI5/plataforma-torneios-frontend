import { api } from "./api";
import type {
  Tournament,
  TournamentUI,
  CreateInscricaoResponse,
  TorneioCriacaoError,
  TorneioCriacaoResponse,
  GerarChaveResponse,
  UserInscriptionResponse,
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
  turno: "MANHA" | "TARDE" | "NOITE";
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
      console.error("Erro na API [getTorneios]:", {
        status: error.response?.status,
        data: JSON.stringify(error.response?.data),
        message: error.message,
        url: error.config?.url,
      });
    } else {
      console.error("Erro inesperado [getTorneios]:", error);
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
    const response = await api.post<CreateTorneioResponse>("/torneio", torneioData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { sucesso: true, dados: response.data.data };
  } catch (error: unknown) {
    const torneioError = mapearErroParaTorneioCriacao(error);
    if (axios.isAxiosError(error)) {
      console.error("Erro ao criar torneio:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return { sucesso: false, erro: torneioError };
  }
};

const mapearErroParaTorneioCriacao = (error: unknown): TorneioCriacaoError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const mensagemAPI = error.response?.data?.message;

    switch (status) {
      case 409:
        return { type: "duplicate-name", mensagem: "Já existe um torneio com esse nome.", statusCode: 409 };
      case 401:
        return { type: "invalid-token", mensagem: "Sua sessão expirou. Faça login novamente.", statusCode: 401 };
      case 403:
        return { type: "forbidden", mensagem: "Você não tem permissão para criar torneios.", statusCode: 403 };
      case 400:
        return { type: "validation-error", mensagem: mensagemAPI || "Dados inválidos. Verifique os campos.", statusCode: 400 };
      default:
        return { type: "generic-error", mensagem: "Erro ao criar torneio. Tente novamente.", statusCode: status };
    }
  }
  return { type: "generic-error", mensagem: "Erro inesperado ao criar torneio. Tente novamente." };
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

export const gerarChaveTorneio = async (
  id_torneio: string
): Promise<GerarChaveResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      sucesso: false,
      mensagem: "Sessão expirada. Faça login novamente.",
    };
  }

  try {
    const response = await api.post<{ message: string; data: unknown[] }>(
      `/torneio/${id_torneio}/gerar-chave`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      sucesso: true,
      mensagem: response.data.message,
      totalPartidas: Array.isArray(response.data.data)
        ? response.data.data.length
        : undefined,
    };
  } catch (error: unknown) {
    let mensagem = "Erro ao gerar partidas. Tente novamente.";

    if (axios.isAxiosError(error)) {
      mensagem =
        error.response?.data?.error ||
        error.response?.data?.message ||
        mensagem;
      console.error("Erro ao gerar chave do torneio:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado ao gerar chave do torneio:", error);
    }

    return { sucesso: false, mensagem };
  }
};

export const registerUserInTournament = async (
  id_torneio: string,
  id_usuario: string
): Promise<{ sucesso: boolean; mensagem?: string; data?: UserInscriptionResponse }> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { sucesso: false, mensagem: "Sessão expirada. Faça login novamente." };
  }

  try {
    const response = await api.post<UserInscriptionResponse>(
      "/inscricoes",
      { id_usuario, id_torneio },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { sucesso: true, data: response.data };
  } catch (error: unknown) {
    let mensagem = "Erro ao inscrever no torneio.";
    if (axios.isAxiosError(error)) {
      mensagem = error.response?.data?.error || error.response?.data?.message || mensagem;
      console.error("Erro na inscrição individual:", error.response?.data || error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
    return { sucesso: false, mensagem };
  }
};

export const getInscricaoDoUsuario = async (
  id_torneio: string,
  id_usuario: string
): Promise<string | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await api.get<Array<{ id_inscricao: string; id_usuario: string }>>(
      `/inscricoes/torneio/${id_torneio}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const inscricoes = Array.isArray(response.data)
      ? response.data
      : (response.data as { data?: Array<{ id_inscricao: string; id_usuario: string }> }).data ?? [];

    const minha = inscricoes.find((i) => i.id_usuario === id_usuario);
    return minha?.id_inscricao ?? null;
  } catch {
    return null;
  }
};

export const cancelarInscricao = async (
  id_inscricao: string
): Promise<{ sucesso: boolean; mensagem: string }> => {
  const token = localStorage.getItem("token");
  if (!token) return { sucesso: false, mensagem: "Não autenticado" };

  try {
    await api.delete(`/inscricoes/${id_inscricao}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { sucesso: true, mensagem: "Inscrição cancelada com sucesso" };
  } catch (error: unknown) {
    let mensagem = "Erro ao cancelar inscrição.";
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      mensagem = data?.error || data?.message || mensagem;
      console.error("Erro ao cancelar inscrição:", {
        status,
        data: JSON.stringify(data),
        message: error.message,
        url: error.config?.url,
      });
    } else {
      console.error("Erro inesperado ao cancelar inscrição:", error);
    }
    return { sucesso: false, mensagem };
  }
};

export const sairDaEquipe = async (
  id_torneio: string
): Promise<{ sucesso: boolean; mensagem?: string }> => {
  const token = localStorage.getItem("token");
  if (!token) return { sucesso: false, mensagem: "Não autenticado" };

  try {
    await api.post(
      `/equipe/sair/${id_torneio}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { sucesso: true };
  } catch (error: unknown) {
    // 400 = usuário não está em nenhuma equipe → não bloqueia o fluxo
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.warn("Usuário não estava em uma equipe, continuando...");
      return { sucesso: true };
    }
    if (axios.isAxiosError(error)) {
      console.error("Erro ao sair da equipe:", error.response?.data || error.message);
    }
    return { sucesso: false, mensagem: "Erro ao sair da equipe." };
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
