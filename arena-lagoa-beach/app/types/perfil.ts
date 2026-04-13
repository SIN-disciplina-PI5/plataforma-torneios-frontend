export interface PerfilUsuario {
  id_usuario?: number;
  nome: string;
  email: string;
  username: string;
  patente: string;
}

export interface UpdatePerfilRequest {
  nome?: string;
  email?: string;
  username?: string;
  senha?: string;
}
