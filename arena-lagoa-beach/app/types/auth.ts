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

export interface ApiError {
  error: string;
}
