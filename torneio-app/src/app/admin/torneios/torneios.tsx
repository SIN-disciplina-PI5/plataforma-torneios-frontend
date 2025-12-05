import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, ActivityIndicator, RefreshControl,
  SafeAreaView, Modal 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { api } from "../../../services/api"
import BarraNavegacaoAdmin from "../../../../components/BarraNavegacaoAdmin"

// Importações do React Native Paper
import {
  Button,
  Card,
  Snackbar,
  FAB,
  Chip,
  Divider
} from 'react-native-paper'

interface Torneio {
  id_torneio: string
  nome: string
  categoria: string
  vagas: number
  status: boolean
  createdAt: string
  updatedAt: string
}

interface ErrorResponse {
  error?: string
  message?: string
  details?: string
}

export default function ListarTorneios() {
  const [torneios, setTorneios] = useState<Torneio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogoConfirmacaoVisivel, setDialogoConfirmacaoVisivel] = useState(false)
  const [dialogoErroVisivel, setDialogoErroVisivel] = useState(false)
  const [torneioParaDeletar, setTorneioParaDeletar] = useState<{id: string, nome: string} | null>(null)
  const [erroDetalhes, setErroDetalhes] = useState<ErrorResponse | null>(null)
  const [snackbarVisivel, setSnackbarVisivel] = useState(false)
  const [mensagemSnackbar, setMensagemSnackbar] = useState("")
  const router = useRouter()

  async function carregarTorneios() {
    try {
      setCarregando(true)
      
      const response = await api.get("/torneio")
      const dados = response.data.data || response.data
      
      if (Array.isArray(dados)) {
        setTorneios(dados)
      } else {
        mostrarErroDialog({
          error: "Formato de dados inválido",
          message: "Não foi possível processar os dados dos torneios"
        })
      }
      
    } catch (error: any) {
      console.log("Erro ao carregar torneios:", error)
      
      const erroData: ErrorResponse = {
        error: error.response?.data?.error || "Erro de conexão",
        message: error.response?.data?.message || "Não foi possível carregar torneios",
        details: `Status: ${error.response?.status || "Sem conexão"}`
      }
      
      mostrarErroDialog(erroData)
    } finally {
      setCarregando(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    carregarTorneios()
  }, [])

  function mostrarConfirmacaoDeletar(id_torneio: string, nomeTorneio: string) {
    setTorneioParaDeletar({ id: id_torneio, nome: nomeTorneio })
    setDialogoConfirmacaoVisivel(true)
  }

  async function confirmarDeletarTorneio() {
    if (!torneioParaDeletar) return
    
    try {
      await api.delete(`/torneio/${torneioParaDeletar.id}`)
      setTorneios(torneios.filter(t => t.id_torneio !== torneioParaDeletar.id))
      mostrarSnackbar(`Torneio "${torneioParaDeletar.nome}" excluído com sucesso!`, "success")
    } catch (error: any) {
      console.log("Erro ao deletar torneio:", error.response?.data)
      
      // Verifica se é erro de foreign key
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message
      
      if (errorMessage?.toLowerCase().includes('foreign') || 
          errorMessage?.toLowerCase().includes('chave') || 
          errorMessage?.toLowerCase().includes('constraint') ||
          errorMessage?.toLowerCase().includes('referenced')) {
        mostrarErroDialog({
          error: "Não é possível excluir",
          message: "Este torneio possui inscrições ou dados relacionados",
          details: "Exclua primeiro as inscrições ou dados associados a este torneio antes de excluí-lo."
        })
      } else {
        mostrarErroDialog({
          error: "Erro ao excluir",
          message: errorMessage || "Ocorreu um erro ao tentar excluir o torneio",
          details: `Status: ${error.response?.status || "Erro desconhecido"}`
        })
      }
    } finally {
      setDialogoConfirmacaoVisivel(false)
      setTorneioParaDeletar(null)
    }
  }

  function cancelarDeletarTorneio() {
    setDialogoConfirmacaoVisivel(false)
    setTorneioParaDeletar(null)
  }

  function mostrarErroDialog(erro: ErrorResponse) {
    setErroDetalhes(erro)
    setDialogoErroVisivel(true)
  }

  function fecharErroDialog() {
    setDialogoErroVisivel(false)
    setErroDetalhes(null)
  }

  function mostrarSnackbar(mensagem: string, tipo: "success" | "error" | "info" = "info") {
    setMensagemSnackbar(mensagem)
    setSnackbarVisivel(true)
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
      return { texto: "Inativo", cor: "#FF3B30", icon: "close-circle" }
    }
    return { texto: "Ativo", cor: "#2FA11D", icon: "checkmark-circle" }
  }

  if (carregando && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2FA11D" />
            <Text style={styles.carregandoTexto}>Carregando torneios...</Text>
          </View>
          <View style={styles.barraFixa}>
            <BarraNavegacaoAdmin />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2FA11D"]}
            />
          }
          showsVerticalScrollIndicator={true}
        >
          {torneios.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Ionicons name="trophy-outline" size={60} color="#CCC" />
                <Text style={styles.emptyText}>Nenhum torneio encontrado</Text>
                <Text style={styles.emptySubtext}>
                  Crie seu primeiro torneio para começar
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => router.push("/admin/torneios/criar")}
                  style={styles.criarButton}
                  icon="plus"
                  buttonColor="#2FA11D"
                  textColor="#FFF"
                >
                  Criar Primeiro Torneio
                </Button>
              </Card.Content>
            </Card>
          ) : (
            torneios.map((torneio) => {
              const status = getStatusTorneio(torneio)
              
              return (
                <Card key={torneio.id_torneio} style={styles.card} elevation={2}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.headerLeft}>
                        <Chip 
                          mode="outlined"
                          style={[styles.categoriaChip, { borderColor: '#4A90E2' }]}
                          textStyle={{ color: '#4A90E2', fontWeight: '600' }}
                        >
                          {torneio.categoria || "Sem categoria"}
                        </Chip>
                        
                        <View style={styles.statusContainer}>
                          <Ionicons 
                            name={status.icon as any} 
                            size={14} 
                            color={status.cor} 
                          />
                          <Text style={[styles.statusText, { color: status.cor }]}>
                            {status.texto}
                          </Text>
                        </View>
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
                          onPress={() => mostrarConfirmacaoDeletar(torneio.id_torneio, torneio.nome)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.nomeTorneio}>{torneio.nome}</Text>

                    <Divider style={styles.divider} />

                    <View style={styles.infoContainer}>
                      <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{torneio.vagas} vagas disponíveis</Text>
                      </View>
                      
                      <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>
                          Criado em: {formatarData(torneio.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              )
            })
          )}
          
          {/* Espaço extra para a navbar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botão Flutuante */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push("/admin/torneios/criar")}
          color="#FFF"
          customSize={56}
        />

        <View style={styles.barraFixa}>
          <BarraNavegacaoAdmin />
        </View>

        {/* Modal de Confirmação de Exclusão - CENTRALIZADO */}
        <Modal
          visible={dialogoConfirmacaoVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelarDeletarTorneio}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="alert-circle" size={50} color="#FF3B30" />
              </View>
              
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              
              <Text style={styles.modalText}>
                Tem certeza que deseja excluir o torneio{" "}
                <Text style={styles.modalHighlight}>
                  "{torneioParaDeletar?.nome}"
                </Text>
                ?
              </Text>
              
              <Text style={styles.modalWarning}>
                Esta ação não pode ser desfeita.
              </Text>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity 
                  style={styles.modalButtonCancel}
                  onPress={cancelarDeletarTorneio}
                >
                  <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalButtonDelete}
                  onPress={confirmarDeletarTorneio}
                >
                  <Text style={styles.modalButtonDeleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Erro - CENTRALIZADO */}
        <Modal
          visible={dialogoErroVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={fecharErroDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="warning" size={50} color="#FF3B30" />
              </View>
              
              <Text style={styles.modalErrorTitle}>
                {erroDetalhes?.error || "Erro"}
              </Text>
              
              <Text style={styles.modalErrorMessage}>
                {erroDetalhes?.message || "Ocorreu um erro inesperado"}
              </Text>
              
              {erroDetalhes?.details && (
                <>
                  <View style={styles.errorDetailsBox}>
                    <Ionicons name="information-circle-outline" size={16} color="#666" />
                    <Text style={styles.errorDetailsText}>
                      {erroDetalhes.details}
                    </Text>
                  </View>
                </>
              )}
              
              {/* Mensagem especial para foreign key */}
              {erroDetalhes?.message?.toLowerCase().includes('foreign') && (
                <View style={styles.foreignKeyAdvice}>
                  <Ionicons name="bulb-outline" size={16} color="#2FA11D" />
                  <Text style={styles.foreignKeyText}>
                    Para excluir este torneio, primeiro remova todas as inscrições e dados relacionados.
                  </Text>
                </View>
              )}

              <View style={styles.modalSingleButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalButtonOk}
                  onPress={fecharErroDialog}
                >
                  <Text style={styles.modalButtonOkText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Snackbar para mensagens de sucesso */}
        <Snackbar
          visible={snackbarVisivel}
          onDismiss={() => setSnackbarVisivel(false)}
          duration={3000}
          action={{
            label: 'Fechar',
            onPress: () => setSnackbarVisivel(false),
          }}
          style={styles.snackbar}
          wrapperStyle={styles.snackbarWrapper}
        >
          {mensagemSnackbar}
        </Snackbar>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
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
    fontSize: 14
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
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
    marginHorizontal: 20,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  headerLeft: {
    flex: 1,
    gap: 8,
  },
  categoriaChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  acoesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  acaoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  nomeTorneio: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#F0F0F0",
  },
  infoContainer: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  emptyCard: {
    marginTop: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#888",
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
    textAlign: 'center',
    marginBottom: 24,
  },
  criarButton: {
    marginTop: 8,
  },
  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    zIndex: 1000,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#2FA11D',
    zIndex: 1001,
  },
  // Estilos para os Modais Centralizados
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalErrorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  modalErrorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
  },
  modalHighlight: {
    fontWeight: 'bold',
    color: '#2FA11D',
  },
  modalWarning: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalSingleButtonContainer: {
    width: '100%',
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDelete: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDeleteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonOk: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#2FA11D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonOkText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorDetailsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  errorDetailsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  foreignKeyAdvice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F3FDF1',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2FA11D40',
  },
  foreignKeyText: {
    fontSize: 14,
    color: '#2FA11D',
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  snackbar: {
    backgroundColor: '#2FA11D',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  snackbarWrapper: {
    bottom: 100, // Eleva o snackbar acima da navbar
  },
})