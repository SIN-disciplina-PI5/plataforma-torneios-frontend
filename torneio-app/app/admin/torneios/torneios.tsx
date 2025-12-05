import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, RefreshControl 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { api } from "../../../src/services/api"
import BarraNavegacaoAdmin from "../../../components/BarraNavegacaoAdmin"

interface Torneio {
  id_torneio: string
  nome: string
  categoria: string
  vagas: number
  status: boolean
  createdAt: string
  updatedAt: string
}

export default function ListarTorneios() {
  const [torneios, setTorneios] = useState<Torneio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  async function carregarTorneios() {
    try {
      setCarregando(true)
      
      const response = await api.get("/torneio")
      const dados = response.data.data || response.data
      
      if (Array.isArray(dados)) {
        setTorneios(dados)
      } else {
        Alert.alert("Erro", "Formato de dados inválido")
      }
      
    } catch (error: any) {
      console.log("Erro ao carregar torneios:", error)
      Alert.alert("Erro", `Não foi possível carregar torneios. Status: ${error.response?.status || "Sem conexão"}`)
    } finally {
      setCarregando(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    carregarTorneios()
  }, [])

  async function deletarTorneio(id_torneio: string, nomeTorneio: string) {
    const confirmado = window.confirm(`Excluir o torneio "${nomeTorneio}"?`)
    
    if (!confirmado) return
    
    try {
      await api.delete(`/torneio/${id_torneio}`)
      setTorneios(torneios.filter(t => t.id_torneio !== id_torneio))
      window.alert(`Torneio "${nomeTorneio}" excluído com sucesso!`)
    } catch (error: any) {
      const erro = error.response?.data?.error || "Erro ao excluir"
      window.alert(`Erro: ${erro}`)
    }
  }

  function formatarData(dataISO: string) {
    if (!dataISO) return "---"
    try {
      return new Date(dataISO).toLocaleDateString('pt-BR')
    } catch {
      return "---"
    }
  }

  function editarTorneio(id_torneio: string) {
    router.push(`/admin/torneios/editar?id=${id_torneio}`)
  }

  function onRefresh() {
    setRefreshing(true)
    carregarTorneios()
  }

  function getStatusTorneio(torneio: Torneio) {
    if (!torneio.status) {
      return { texto: "Inativo", cor: "#FF3B30" }
    }
    return { texto: "Ativo", cor: "#2FA11D" }
  }

  if (carregando && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2FA11D" />
          <Text style={styles.carregandoTexto}>Carregando torneios...</Text>
        </View>
        <View style={styles.barraFixa}>
          <BarraNavegacaoAdmin />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Torneios</Text>
        <Text style={styles.headerSubtitle}>Essa semana</Text>
      </View>

      <TouchableOpacity 
        style={styles.novoButton}
        onPress={() => router.push("/admin/torneios/criar")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#2FA11D" />
        <Text style={styles.novoButtonText}>Novo Torneio</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2FA11D"]}
          />
        }
      >
        {torneios.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={50} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum torneio encontrado</Text>
            <TouchableOpacity 
              style={styles.recarregarButton}
              onPress={carregarTorneios}
            >
              <Text style={styles.recarregarText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          torneios.map((torneio) => {
            const status = getStatusTorneio(torneio)
            
            return (
              <View key={torneio.id_torneio} style={styles.card}>
                
                <View style={styles.cardHeader}>
                  <View style={[styles.categoriaBadge, { backgroundColor: '#4A90E220' }]}>
                    <Text style={[styles.categoriaText, { color: '#4A90E2' }]}>
                      {torneio.categoria || "Sem categoria"}
                    </Text>
                  </View>
                  
                  <View style={styles.acoesContainer}>
                    <TouchableOpacity 
                      style={styles.acaoButton}
                      onPress={() => editarTorneio(torneio.id_torneio)}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#666" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.acaoButton}
                      onPress={() => deletarTorneio(torneio.id_torneio, torneio.nome)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.nomeTorneio}>{torneio.nome}</Text>

                <View style={styles.vagasContainer}>
                  <Text style={styles.vagasText}>
                    {torneio.vagas} vagas |{" "}
                    <Text style={[styles.statusText, { color: status.cor }]}>
                      {status.texto}
                    </Text>
                  </Text>
                </View>

                <View style={styles.datesContainer}>
                  <Text style={styles.dateText}>
                    Criado em: {formatarData(torneio.createdAt)}
                  </Text>
                </View>

              </View>
            )
          })
        )}
      </ScrollView>

      <View style={styles.barraFixa}>
        <BarraNavegacaoAdmin />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 50
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carregandoTexto: {
    marginTop: 12,
    color: "#666",
    fontSize: 14
  },
  header: {
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111"
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4
  },
  novoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3FDF1",
    borderWidth: 1,
    borderColor: "#2FA11D",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignSelf: "flex-start"
  },
  novoButtonText: {
    color: "#2FA11D",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 80
  },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  categoriaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: "600"
  },
  acoesContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  acaoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8
  },
  nomeTorneio: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8
  },
  vagasContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  vagasText: {
    fontSize: 14,
    color: "#444"
  },
  statusText: {
    fontWeight: "600"
  },
  datesContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 8
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
    marginBottom: 20
  },
  recarregarButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8
  },
  recarregarText: {
    color: "#666",
    fontWeight: "500"
  },
  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
})