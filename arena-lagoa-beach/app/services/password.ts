import { api } from "./api"; 

export const forgotPassword = async (email: string) => {
  const response = await api.post("/password/forgot-password", { email });
  return response.data; 
};

export const resetPassword = async (token: string, novaSenha: string) => {
  const response = await api.post("/password/reset-password", { token, novaSenha });
  return response.data; 
};