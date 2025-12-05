import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import BarraNavegacaoAdmin from "../../../../components/BarraNavegacaoAdmin"
import { api } from "../../../services/api"
import { useRouter } from "expo-router"
import { TextInput, Button, Chip, Divider, Snackbar } from "react-native-paper"

export default function CriarTorneio() {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [vagas, setVagas] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [snackbarVisivel, setSnackbarVisivel] = useState(false)
  const [mensagemSnackbar, setMensagemSnackbar] = useState("")
  const [dialogoErroVisivel, setDialogoErroVisivel] = useState(false)
  const [erroDetalhes, setErroDetalhes] = useState("")
  
  const categorias = ["Iniciante", "Intermediário", "Avançado"]

  const router = useRouter()

  async function criarTorneio() {
    if (!nome || !vagas || Number(vagas) <= 0) {
      mostrarErroDialog("Preencha todos os campos corretamente")
      return
    }

    try {
      setCarregando(true)
      await api.post("/torneio", {
        nome,
        categoria,
        vagas: Number(vagas)
      })

      mostrarSnackbar("Torneio criado com sucesso ✅")

      setNome("")
      setCategoria("")
      setVagas("")

      router.replace("/admin/torneios/torneios")

    } catch (error: any) {
      console.log(error.response?.data || error.message)
      const erroMsg = error.response?.data?.error || error.response?.data?.message || "Erro ao criar torneio"
      mostrarErroDialog(erroMsg)
    } finally {
      setCarregando(false)
    }
  }

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          <Text style={styles.title}>Criar Torneio</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Torneio de Verão"
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
                  selectedColor="#2FA11D"
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
            onPress={criarTorneio}
            disabled={!nome || !vagas || Number(vagas) <= 0 || carregando}
            loading={carregando}
            style={[
              styles.button,
              (!nome || !vagas || Number(vagas) <= 0) && styles.buttonDisabled
            ]}
            buttonColor="#2FA11D"
            textColor="#FFF"
            icon="check"
          >
            Criar Torneio
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

      <View style={styles.barraFixa}>
        <BarraNavegacaoAdmin />
      </View>

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
            
            <Text style={styles.modalErrorTitle}>Erro ao criar torneio</Text>
            
            <Text style={styles.modalErrorMessage}>
              {erroDetalhes}
            </Text>

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

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    color: "#111"
  },
  field: {
    marginBottom: 24
  },
  label: {
    fontSize: 14,
    color: "#111",
    marginBottom: 8,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "#FFF",
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  chip: {
    backgroundColor: "#FFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#F3FDF1",
    borderColor: "#2FA11D",
  },
  chipText: {
    color: "#444",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#2FA11D",
    fontWeight: "600",
  },
  button: {
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    marginVertical: 30,
    backgroundColor: "#F0F0F0",
  },
  voltarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    gap: 8,
  },
  voltarText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500"
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
  // Estilos para o Modal
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
  modalErrorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalErrorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalSingleButtonContainer: {
    width: '100%',
    marginTop: 8,
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
  snackbar: {
    backgroundColor: '#2FA11D',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  snackbarWrapper: {
    bottom: 100,
  },
})