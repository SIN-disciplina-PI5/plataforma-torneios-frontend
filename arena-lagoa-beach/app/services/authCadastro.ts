import { api } from "./api";

export interface SignupRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface SignupResponse {
  message: string;
  data: {
    id_usuario: number;
    nome: string;
    email: string;
    role: string;
    patente: string;
  };
}

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/users/signup", data);

  return response.data;
};
