import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BarraNavegacao from "../../../../components/BarraNavegação";

const torneios = [
  {
    id: "1",
    categoria: "Intermediário",
    nome: "Torneio de Verão",
    vagas: 28,
    status: "Ativo",
    imagem: require("../assets/beach1.png"),
  },
  {
    id: "2",
    categoria: "Básico",
    nome: "Torneio de Verão",
    vagas: 0,
    status: "Esgotado",
    imagem: require("../assets/beach2.png"),
  },
  {
    id: "3",
    categoria: "Básico",
    nome: "Torneio de Verão",
    vagas: 28,
    status: "Ativo",
    imagem: require("../assets/beach1.png"),
  },
  {
    id: "4",
    categoria: "Avançado",
    nome: "Torneio de Verão",
    vagas: 28,
    status: "Ativo",
    imagem: require("../assets/beach2.png"),
  },
];

export default function ListaTorneios() {
  const categoriaStyles: { [key: string]: any } = {
    Básico: styles.categoria_basica,
    Intermediário: styles.categoria_intermediaria,
    Avançado: styles.categoria_avancada,
  };

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Torneios (estático)</Text>

        {torneios.map((item) => {
          const isAtivo = item.status === "Ativo";

          return (
            <View key={item.id} style={styles.card}>
              <Image source={item.imagem} style={styles.imagem} />

              <View>
                <Text style={categoriaStyles[item.categoria]}>
                  {item.categoria}
                </Text>

                <Text style={styles.nome}>{item.nome}</Text>

                {/* Status colorido 🔥 */}
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

                {/* Botão Inscrever / Esgotado 🔥 */}
                <TouchableOpacity
                  style={[
                    styles.botao,
                    { backgroundColor: isAtivo ? "#129E82" : "#C23434" },
                  ]}
                  disabled={!isAtivo}
                >
                  <Text style={styles.textoBotao}>
                    {isAtivo ? "Inscrever-se" : "Esgotado"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.barraFixa}>
        <BarraNavegacao />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 20,
    paddingBottom: 120,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

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

  imagem: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },

  categoria_basica: {
    color: "#129E82",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoria_intermediaria: {
    color: "#D7A400",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoria_avancada: {
    color: "#C23434",
    fontSize: 14,
    fontWeight: "bold",
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },

  info: {
    marginTop: 5,
  },

  botao: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});