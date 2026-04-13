import { api } from "./api";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token", error);
    return null;
  }
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/users/login", data);

  if (typeof window !== "undefined" && response.data.token) {
    localStorage.setItem("token", response.data.token);

    const payload = decodeJWT(response.data.token);

    console.log("Conteúdo escondido no Token:", payload);

    const userId = payload?.id || payload?.sub || payload?.id_usuario;

    if (userId) {
      localStorage.setItem("userId", userId.toString());
    } else {
      console.warn("Aviso: ID não encontrado dentro do token!");
    }
  }

  return response.data;
};
