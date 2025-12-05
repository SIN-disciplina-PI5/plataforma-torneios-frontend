import { 
    View, Text, StyleSheet, TouchableOpacity, 
    ScrollView, SafeAreaView, Modal, KeyboardAvoidingView, Platform 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { TextInput, Button, Chip, Divider, Snackbar, ActivityIndicator } from "react-native-paper"

import BarraNavegacaoAdmin from "../../../components/BarraNavegacaoAdmin"
import { api } from "../../../src/services/api"

export default function EditarTorneio() {
  const { id } = useLocalSearchParams()
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [vagas, setVagas] = useState("")
  
  const [carregando, setCarregando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(true)
  
  const [snackbarVisivel, setSnackbarVisivel] = useState(false)
  const [mensagemSnackbar, setMensagemSnackbar] = useState("")
  
  const [dialogoErroVisivel, setDialogoErroVisivel] = useState(false)
  const [erroDetalhes, setErroDetalhes] = useState("")
  
  const categorias = ["Iniciante", "Intermediário", "Avançado"]
  const router = useRouter()

  useEffect(() => {
    if (id) {
        buscarTorneio()
    }
  }, [id])

  async function buscarTorneio() {
    try {
      setCarregandoDados(true)
      const response = await api.get(`/torneio/${id}`)
      
      const torneio = response.data.data || response.data

      if (torneio) {
          setNome(torneio.nome || "")
          setCategoria(torneio.categoria || "")
          setVagas(torneio.vagas ? String(torneio.vagas) : "")
      }
    } catch (error: any) {
      console.log("Erro ao buscar:", error)
      const erroMsg = error.response?.data?.error || error.response?.data?.message || "Erro ao carregar dados"
      mostrarErroDialog(erroMsg)
    } finally {
      setCarregandoDados(false)
    }
  }

  async function editarTorneio() {
    if (!nome.trim() || !vagas || Number(vagas) <= 0) {
      mostrarErroDialog("Verifique se o nome está preenchido e se as vagas são maiores que 0.")
      return
    }

    try {
      setCarregando(true)
      
      const payload = {
        nome,
        categoria,
        vagas: Number(vagas)
      }

      console.log("Enviando PATCH:", payload)

      await api.patch(`/torneio/${id}`, payload)

      mostrarSnackbar("Torneio atualizado com sucesso ✅")

      setTimeout(() => {
          router.replace("/admin/torneios/torneios")
      }, 1000)

    } catch (error: any) {
      console.error("ERRO EDITAR:", error.response?.status, error.response?.data)
      
      const status = error.response?.status
      const msgBackend = error.response?.data?.message || error.response?.data?.error
      
      let msgFinal = "Ocorreu um erro ao salvar."
      
      if (status === 404) msgFinal = "Torneio não encontrado (Erro 404). Verifique se o ID está correto."
      if (status === 403) msgFinal = "Sem permissão. Verifique seu login."
      if (msgBackend) msgFinal = `${msgFinal}\n\n${msgBackend}`

      mostrarErroDialog(msgFinal)
    } finally {
      setCarregando(false)
    }
  }

  // --- Funções Visuais Auxiliares ---
  function mostrarSnackbar(mensagem: string) {
    setMensagemSnackbar(mensagem)
    setSnackbarVisivel(true)
  }

  function mostrarErroDialog(erro: string) {
    setErroDetalhes(erro)
    setDialogoErroVisivel(true)
  }

  function fecharErroDialog() {
    setDialogoErroVisivel(false)
    setErroDetalhes("")
  }

  if (carregandoDados) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2FA11D" />
          <Text style={styles.carregandoTexto}>Buscando informações do torneio...</Text>
        </View>
        <BarraNavegacaoAdmin />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>

            <Text style={styles.title}>Editar Torneio</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    placeholder="Ex: Torneio de Verão"
                    placeholderTextColor="#AAA"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    outlineColor="#E0E0E0"
                    activeOutlineColor="#2FA11D"
                    theme={{ colors: { primary: '#2FA11D' } }}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.chipsContainer}>
                {categorias.map((item) => (
                    <Chip
                        key={item}
                        mode="outlined"
                        selected={categoria === item}
                        onPress={() => setCategoria(item)}
                        style={[
                            styles.chip,
                            categoria === item && styles.chipActive
                        ]}
                        textStyle={[
                            styles.chipText,
                            categoria === item && styles.chipTextActive
                        ]}
                        showSelectedCheck={categoria === item}
                    >
                    {item}
                    </Chip>
                ))}
                </View>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Vagas</Text>
                <TextInput
                    placeholder="0"
                    placeholderTextColor="#AAA"
                    style={styles.input}
                    keyboardType="numeric"
                    value={vagas}
                    onChangeText={(text) => setVagas(text.replace(/[^0-9]/g, ""))}
                    mode="outlined"
                    outlineColor="#E0E0E0"
                    activeOutlineColor="#2FA11D"
                    theme={{ colors: { primary: '#2FA11D' } }}
                />
            </View>

            <Button
                mode="contained"
                onPress={editarTorneio}
                loading={carregando}
                disabled={carregando}
                style={styles.button}
                buttonColor="#2FA11D"
                textColor="#FFF"
                icon="content-save"
            >
                Salvar Alterações
            </Button>

            <Divider style={styles.divider} />

            <TouchableOpacity
                style={styles.voltarButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={20} color="#666" />
                <Text style={styles.voltarText}>Voltar para lista</Text>
            </TouchableOpacity>

            </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Navbar Fixa */}
      <BarraNavegacaoAdmin />

      {/* Modal de Erro */}
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
            
            <Text style={styles.modalErrorTitle}>Atenção</Text>
            <Text style={styles.modalErrorMessage}>{erroDetalhes}</Text>

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

      <Snackbar
        visible={snackbarVisivel}
        onDismiss={() => setSnackbarVisivel(false)}
        duration={3000}
        style={styles.snackbar}
        wrapperStyle={styles.snackbarWrapper}
      >
        {mensagemSnackbar}
      </Snackbar>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  container: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20, paddingTop: 20 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  carregandoTexto: { fontSize: 16, color: "#666", marginTop: 10 },
  
  title: { fontSize: 24, fontWeight: "700", marginBottom: 30, color: "#111" },
  field: { marginBottom: 24 },
  label: { fontSize: 14, color: "#111", marginBottom: 8, fontWeight: "600" },
  input: { backgroundColor: "#FFF" },
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  chip: { backgroundColor: "#FFF", borderColor: "#E0E0E0", borderWidth: 1 },
  chipActive: { backgroundColor: "#F3FDF1", borderColor: "#2FA11D" },
  chipText: { color: "#444", fontSize: 14 },
  chipTextActive: { color: "#2FA11D", fontWeight: "600" },
  
  button: { marginTop: 10, paddingVertical: 6, borderRadius: 10 },
  divider: { marginVertical: 30, backgroundColor: "#F0F0F0" },
  
  voltarButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 10, backgroundColor: "#F5F5F5", gap: 8 },
  voltarText: { color: "#666", fontSize: 14, fontWeight: "500" },
  
  // Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center', elevation: 10 },
  modalIconContainer: { marginBottom: 16 },
  modalErrorTitle: { fontSize: 20, fontWeight: '700', color: '#FF3B30', textAlign: 'center', marginBottom: 12 },
  modalErrorMessage: { fontSize: 16, color: '#333', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  modalSingleButtonContainer: { width: '100%', marginTop: 8 },
  modalButtonOk: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#2FA11D', alignItems: 'center', justifyContent: 'center' },
  modalButtonOkText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  snackbar: { backgroundColor: '#2FA11D', borderRadius: 8, marginHorizontal: 20 },
  snackbarWrapper: { bottom: 80 },
})