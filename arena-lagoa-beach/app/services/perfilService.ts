import { api } from "./api";
import { PerfilUsuario, UpdatePerfilRequest } from "@/app/types/perfil";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const getUserId = () =>
  typeof window !== "undefined" ? localStorage.getItem("userId") : null;

export const getMeuPerfil = async (): Promise<PerfilUsuario | null> => {
  const token = getToken();
  const userId = getUserId();

  if (!token || !userId) return null;

  const response = await api.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data || response.data;
};

export const updateMeuPerfil = async (data: UpdatePerfilRequest) => {
  const token = getToken();
  const userId = getUserId();

  const response = await api.patch(`/users/edit/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteMinhaConta = async () => {
  const token = getToken();
  const userId = getUserId();

  const response = await api.delete(`/users/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
