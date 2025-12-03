const API_URL = "https://plataforma-torneios-backend.vercel.app";

async function getToken() {
  // 🔥 Aqui você adapta depois
  // ex: return await AsyncStorage.getItem("token");
  return "COLOQUE_SEU_TOKEN_AQUI";
}

export async function inscreverNoTorneio(
  id_equipe: string,
  id_torneio: string
) {
  const token = await getToken();

  const response = await fetch(`${API_URL}/inscricao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 obrigatório
    },
    body: JSON.stringify({
      id_equipe,
      id_torneio,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao realizar inscrição");
  }

  return data;
}
