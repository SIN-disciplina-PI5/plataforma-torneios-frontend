export interface PerfilUsuario {
  id_usuario?: number;
  nome: string;
  email: string;
  username: string;
  patente: string;
  foto_perfil?: string;
}

export interface UpdatePerfilRequest {
  nome?: string;
  email?: string;
  username?: string;
  senha?: string;
  foto_perfil?: string;
}
