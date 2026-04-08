import { api } from "./api";
import { Partida } from "@/app/types/partida";

export const getPartidasHome = async (): Promise<Partida[]> => {
  const token = localStorage.getItem("token");
  console.log("Meu token atual:", token); // Se aparecer null aqui, o erro é esse.

  // Ajuste a rota "/partidas/me" para a rota real do seu Swagger/Back-end
  const response = await api.get<Partida[]>("/partidas/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
