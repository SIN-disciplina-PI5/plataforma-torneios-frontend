import { api } from "./api"; 

export const forgotPassword = async (email: string) => {
  const response = await api.post("/forgot-password", { email });
  return response.data; 
};

export const resetPassword = async (token: string, novaSenha: string) => {
  const response = await api.post("/reset-password", { token, novaSenha });
  return response.data; 
};