import { api } from "./api";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const getUserId = () =>
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

type CriarNotificacaoRequest = {
  titulo: string;
  mensagem: string;
  tipo: string;
};

export const criarNotificacao = async (
  data: CriarNotificacaoRequest
) => {
  const token = getToken();
  const userId = getUserId();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  return api.post(
    "/notifications",
    {
      id_usuario: userId,
      ...data,
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
};
