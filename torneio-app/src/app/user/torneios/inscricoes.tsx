import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BarraNavegacao from "../../../../components/BarraNavegacao";
import SuccessModalPaper from "../../../../components/inscricaoRealizada";

interface Torneio {
  id_torneio: string;
  categoria: string;
  nome: string;
  vagas: number;
  status: string;
  imagem: string; // URL ou require
}

export default function ListaTorneios() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inscricaoLoading, setInscricaoLoading] = useState<string | null>(null); // id do torneio em loading
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Pegando torneios do backend
  const fetchTorneios = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch(
        "https://plataforma-torneios-backend.vercel.app/torneios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao buscar torneios");

      const data = await res.json();
      setTorneios(data.data || []);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneios();
  }, []);

  // Função de inscrição
  const handleInscrever = async (id_torneio: string) => {
    try {
      setInscricaoLoading(id_torneio);

      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      // Decodifica o token para pegar id_equipe
      const payload = JSON.parse(
        atob(token.split(".")[1].replace("-", "+").replace("_", "/"))
      );
      const id_equipe = payload.id_equipe;
      if (!id_equipe) throw new Error("Equipe não encontrada no token");

      const res = await fetch(
        "https://plataforma-torneios-backend.vercel.app/inscricoes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_equipe, id_torneio }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("Erro do backend:", text);
        throw new Error("Não foi possível realizar a inscrição");
      }

      setModalVisible(true);
      fetchTorneios(); // Atualiza lista
    } catch (e: any) {
      alert(e.message);
    } finally {
      setInscricaoLoading(null);
    }
  };

  const categoriaStyles: { [key: string]: any } = {
    Básico: styles.categoria_basica,
    Intermediário: styles.categoria_intermediaria,
    Avançado: styles.categoria_avancada,
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Torneios</Text>

        {loading && <ActivityIndicator size="large" color="#129E82" />}

        {torneios.map((item) => {
          const isAtivo = item.status === "Ativo";

          return (
            <View key={item.id_torneio} style={styles.card}>
              <Image
                source={
                  typeof item.imagem === "string"
                    ? { uri: item.imagem }
                    : require("../../../../assets/images/beach1.png")
                }
                style={styles.imagem}
              />

              <View>
                <Text style={categoriaStyles[item.categoria]}>
                  {item.categoria}
                </Text>

                <Text style={styles.nome}>{item.nome}</Text>

                <Text
                  style={[
                    styles.info,
                    {
                      color: isAtivo ? "#129E82" : "#C23434",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {item.vagas} vagas • {item.status}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.botao,
                    { backgroundColor: isAtivo ? "#129E82" : "#C23434" },
                  ]}
                  disabled={!isAtivo || inscricaoLoading === item.id_torneio}
                  onPress={() => handleInscrever(item.id_torneio)}
                >
                  {inscricaoLoading === item.id_torneio ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.textoBotao}>
                      {isAtivo ? "Inscrever-se" : "Esgotado"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.barraFixa}>
        <BarraNavegacao />
      </View>

      <SuccessModalPaper
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 120 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#808080",
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  imagem: { width: 90, height: 90, borderRadius: 10, marginRight: 12 },
  categoria_basica: { color: "#129E82", fontSize: 14, fontWeight: "bold" },
  categoria_intermediaria: {
    color: "#D7A400",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoria_avancada: { color: "#C23434", fontSize: 14, fontWeight: "bold" },
  nome: { fontSize: 18, fontWeight: "bold" },
  info: { marginTop: 5 },
  botao: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 10,
  },
});
