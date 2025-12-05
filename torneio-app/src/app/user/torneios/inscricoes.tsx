import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../services/api";
import InscricaoRealizada from "../../../../components/inscricaoRealizada";
import BarraNavegacao from "../../../../components/BarraNavegacao";

interface Torneio {
  id_torneio: string;
  nome: string;
  categoria: string;
  vagas: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  imagem?: string;
  descricao?: string;
}

interface Equipe {
  id_equipe: string;
  nome: string;
  tag?: string;
  id_capitao: string;
}

interface Inscricao {
  id_inscricao: string;
  id_equipe: string;
  id_torneio: string;
  status: string;
  data_inscricao: string;
}

export default function ListaTorneiosScreen() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [equipeUsuario, setEquipeUsuario] = useState<Equipe | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inscricaoLoading, setInscricaoLoading] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Carregar dados iniciais
  const carregarDados = async () => {
    try {
      setLoading(true);
      await Promise.all([
        carregarTorneios(),
        carregarEquipeUsuario(),
        carregarInscricoes(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar torneios
  const carregarTorneios = async () => {
    try {
      const response = await api.get("/torneio");
      const dados = response.data.data || response.data;

      if (Array.isArray(dados)) {
        // Mapear status boolean para string
        const torneiosFormatados = dados.map((torneio: any) => ({
          ...torneio,
          status: torneio.status ? "Ativo" : "Inativo",
        }));
        setTorneios(torneiosFormatados);
      } else {
        console.error("Formato de dados inválido:", dados);
      }
    } catch (error: any) {
      console.error("Erro ao carregar torneios:", error);
      Alert.alert("Erro", "Não foi possível carregar os torneios");
    }
  };

  // Carregar equipe do usuário
  const carregarEquipeUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // Decodificar token para pegar informações do usuário
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      // Buscar equipe do usuário
      const response = await api.get("/equipe", {
        params: { id_capitao: payload.id },
      });

      if (response.data && response.data.length > 0) {
        setEquipeUsuario(response.data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar equipe:", error);
    }
  };

  // Carregar inscrições existentes
  const carregarInscricoes = async () => {
    try {
      const response = await api.get("/inscricoes");
      setInscricoes(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
    }
  };

  // Verificar se equipe já está inscrita em um torneio
  const verificarInscricao = (idTorneio: string): boolean => {
    if (!equipeUsuario) return false;

    return inscricoes.some(
      (inscricao) =>
        inscricao.id_equipe === equipeUsuario.id_equipe &&
        inscricao.id_torneio === idTorneio
    );
  };

  // Verificar status da inscrição
  const getStatusInscricao = (idTorneio: string) => {
    if (!equipeUsuario) return null;

    const inscricao = inscricoes.find(
      (i) =>
        i.id_equipe === equipeUsuario.id_equipe && i.id_torneio === idTorneio
    );

    return inscricao ? inscricao.status : null;
  };

  // Realizar inscrição
  const handleInscrever = async (torneio: Torneio) => {
    console.log("CLICOU NO BOTÃO", torneio);

    try {
      if (!equipeUsuario) {
        console.log("Você precisa ter uma equipe para se inscrever.");
        return;
      }

      if (torneio.status !== "Ativo") {
        console.log("Torneio não está ativo.");
        return;
      }

      if (verificarInscricao(torneio.id_torneio)) {
        console.log("Equipe já inscrita.");
        return;
      }

      // Confirmar automaticamente (sem Alert)
      setInscricaoLoading(torneio.id_torneio);

      try {
        const response = await api.post("/inscricoes", {
          id_equipe: equipeUsuario.id_equipe,
          id_torneio: torneio.id_torneio,
        });

        if (response.status === 201) {
          setModalVisible(true);
          await carregarInscricoes();
        } else {
          console.log("Falha ao inscrever.");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Erro ao realizar inscrição";
        console.log("Erro:", errorMessage);
      } finally {
        setInscricaoLoading(null);
      }
    } catch (error) {
      console.log("Erro no processo de inscrição:", error);
      setInscricaoLoading(null);
    }
  };

  // Formatador de data
  const formatarData = (dataISO: string) => {
    if (!dataISO) return "---";
    try {
      return new Date(dataISO).toLocaleDateString("pt-BR");
    } catch {
      return "---";
    }
  };

  // Obter cor da categoria
  const getCategoriaCor = (categoria: string) => {
    const cores: { [key: string]: string } = {
      Básico: "#129E82",
      Intermediário: "#D7A400",
      Avançado: "#C23434",
      Iniciante: "#129E82",
      Amador: "#4A90E2",
      Profissional: "#C23434",
    };
    return cores[categoria] || "#666";
  };

  // Obter ícone da categoria
  const getCategoriaIcone = (categoria: string) => {
    const icones: { [key: string]: string } = {
      Básico: "school-outline",
      Intermediário: "star-outline",
      Avançado: "trophy-outline",
      Iniciante: "school-outline",
      Amador: "star-outline",
      Profissional: "trophy-outline",
    };
    return icones[categoria] || "help-outline";
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#129E82" />
          <Text style={styles.carregandoTexto}>Carregando torneios...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Torneios Disponíveis</Text>
      </View>

      {/* Lista de Torneios */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#129E82"]}
          />
        }
      >
        {torneios.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={50} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum torneio disponível</Text>
          </View>
        ) : (
          torneios.map((torneio) => {
            const isAtivo = torneio.status === "Ativo";
            const jaInscrito = verificarInscricao(torneio.id_torneio);
            const statusInscricao = getStatusInscricao(torneio.id_torneio);
            const categoriaCor = getCategoriaCor(torneio.categoria);
            const categoriaIcone = getCategoriaIcone(torneio.categoria);

            return (
              <View key={torneio.id_torneio} style={styles.card}>
                {/* Imagem do Torneio */}
                <Image
                  source={
                    torneio.imagem
                      ? { uri: torneio.imagem }
                      : require("../../../../assets/images/beach1.png")
                  }
                  style={styles.imagem}
                />

                {/* Conteúdo do Card */}
                <View style={styles.cardContent}>
                  {/* Cabeçalho */}
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.categoriaBadge,
                        { backgroundColor: `${categoriaCor}20` },
                      ]}
                    >
                      <Ionicons
                        name={categoriaIcone as any}
                        size={14}
                        color={categoriaCor}
                      />
                      <Text
                        style={[styles.categoriaText, { color: categoriaCor }]}
                      >
                        {torneio.categoria}
                      </Text>
                    </View>

                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isAtivo
                              ? "#129E8220"
                              : "#C2343420",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: isAtivo ? "#129E82" : "#C23434" },
                          ]}
                        >
                          {torneio.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Nome do Torneio */}
                  <Text style={styles.nome}>{torneio.nome}</Text>

                  {/* Descrição (se existir) */}
                  {torneio.descricao && (
                    <Text style={styles.descricao} numberOfLines={2}>
                      {torneio.descricao}
                    </Text>
                  )}

                  {/* Informações */}
                  <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                      <Ionicons name="people-outline" size={16} color="#666" />
                      <Text style={styles.infoText}>
                        {torneio.vagas} vagas disponíveis
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.infoText}>
                        Criado em {formatarData(torneio.createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Status da Inscrição */}
                  {jaInscrito && (
                    <View style={styles.inscricaoStatusContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#4CAF50"
                      />
                      <Text style={styles.inscricaoStatusText}>
                        Inscrito • Status: {statusInscricao || "AGUARDANDO"}
                      </Text>
                    </View>
                  )}

                  {/* Botão de Inscrição */}
                  <TouchableOpacity
                    style={[
                      styles.botao,
                      {
                        backgroundColor:
                          !isAtivo || jaInscrito ? "#CCC" : "#129E82",
                      },
                    ]}
                    disabled={
                      !isAtivo ||
                      jaInscrito ||
                      inscricaoLoading === torneio.id_torneio
                    }
                    onPress={() => handleInscrever(torneio)}
                  >
                    {inscricaoLoading === torneio.id_torneio ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Ionicons
                          name={
                            jaInscrito
                              ? "checkmark-circle"
                              : "arrow-forward-circle"
                          }
                          size={18}
                          color="#FFF"
                          style={styles.botaoIcon}
                        />
                        <Text style={styles.textoBotao}>
                          {jaInscrito
                            ? "Já Inscrito"
                            : !isAtivo
                            ? "Indisponível"
                            : "Inscrever-se"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Barra de Navegação */}
      <View style={styles.barraFixa}>
        <BarraNavegacao />
      </View>

      {/* Modal de Sucesso */}
      <InscricaoRealizada
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Inscrição Realizada!"
        message="Sua equipe foi inscrita no torneio com sucesso. Aguarde a confirmação."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carregandoTexto: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  imagem: {
    width: 100,
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoriaBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  nome: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  inscricaoStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  inscricaoStatusText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
    marginLeft: 6,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoIcon: {
    marginRight: 6,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
  },
  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    zIndex: 10,
  },
});
