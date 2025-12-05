import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import BarraNavegacaoAdmin from "../../components/BarraNavegacaoAdmin" 
import { api } from '../../src/services/api'
import { useLocalSearchParams, useRouter } from "expo-router"

export default function EditarPartida() {
  // O 'id' será capturado aqui automaticamente se enviado como parâmetro
  const { id } = useLocalSearchParams()
  const router = useRouter()

  // Estados
  const [idTorneio, setIdTorneio] = useState("")
  const [fase, setFase] = useState("")
  const [status, setStatus] = useState("PENDENTE")
  const [dataSelecionada, setDataSelecionada] = useState(new Date())

  // Controle e Listas
  const [listaTorneios, setListaTorneios] = useState([])
  const [saving, setSaving] = useState(false)

  // Pickers
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const fasesDisponiveis = ["GRUPOS", "OITAVAS", "QUARTAS", "SEMIFINAL", "FINAL"]

  // --- CARREGAR DADOS ---
  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        const [resTorneios, resPartida] = await Promise.all([
          api.get("/torneio"),
          api.get(`/partida/${id}`)
        ])

        setListaTorneios(resTorneios.data)
        const partida = resPartida.data

        // Preenche os inputs
        if (partida.id_torneio) setIdTorneio(String(partida.id_torneio))
        if (partida.fase) setFase(partida.fase)
        if (partida.status) setStatus(partida.status)
        if (partida.horario) setDataSelecionada(new Date(partida.horario))

      } catch (error) {
        console.log("Erro ao carregar dados", error)
        Alert.alert("Erro", "Não foi possível carregar os dados da partida.")
       // router.back()
      }
    }
    carregarDados()
  }, [id])

  // --- LÓGICA DE DATA E HORA SEGURA ---
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (event.type === "dismissed" || !selectedDate) return

    const novaData = new Date(dataSelecionada)
    novaData.setFullYear(selectedDate.getFullYear())
    novaData.setMonth(selectedDate.getMonth())
    novaData.setDate(selectedDate.getDate())
    setDataSelecionada(novaData)
  }

  const onChangeTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false)
    if (event.type === "dismissed" || !selectedDate) return

    const novaData = new Date(dataSelecionada)
    novaData.setHours(selectedDate.getHours())
    novaData.setMinutes(selectedDate.getMinutes())
    setDataSelecionada(novaData)
  }

  // --- SELEÇÃO DE TORNEIO ---
  function selecionarTorneio(idSelected: any) {
    if (!idSelected) return
    setIdTorneio(String(idSelected))
  }

  // --- SALVAR ALTERAÇÕES ---
  async function editarPartida() {
    setSaving(true)
    try {
      await api.put(`/partida/${id}`, {
        id_torneio: idTorneio,
        fase: fase,
        status: status,
        horario: dataSelecionada.toISOString()
      })

      Alert.alert("Sucesso", "Partida atualizada! ✅", [
        { text: "OK", onPress: () => router.replace("/admin/partidas/partidas") }
      ])
    } catch (error: any) {
      console.log(error)
      Alert.alert("Erro", "Erro ao salvar alterações.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Partida</Text>

        {/* LISTA TORNEIOS */}
        <View style={styles.field}>
          <Text style={styles.label}>Torneio</Text>
          {listaTorneios.map((item: any, index) => {
            const idReal = item.id || item._id || item.id_torneio || index;
            const isSelected = String(idTorneio) === String(idReal);
            return (
              <TouchableOpacity
                key={idReal}
                style={[styles.option, isSelected && styles.optionActive]}
                onPress={() => selecionarTorneio(idReal)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                  {item.nome || `Torneio ${index + 1}`}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#2FA11D" />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* DATA E HORA */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>{dataSelecionada.toLocaleDateString('pt-BR')}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Horário</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateButtonText}>{dataSelecionada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && <DateTimePicker value={dataSelecionada} mode="date" display="default" onChange={onChangeDate} />}
        {showTimePicker && <DateTimePicker value={dataSelecionada} mode="time" is24Hour={true} display="default" onChange={onChangeTime} />}

        {/* FASE */}
        <View style={styles.field}>
          <Text style={styles.label}>Fase</Text>
          {fasesDisponiveis.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, fase === item && styles.optionActive]}
              onPress={() => setFase(item)}
            >
              <Text style={[styles.optionText, fase === item && styles.optionTextActive]}>{item}</Text>
              {fase === item && <Ionicons name="checkmark" size={18} color="#2FA11D" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.5, backgroundColor: "#ccc" }]}
          disabled={saving}
          onPress={editarPartida}
        >
          {saving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.barraFixa}>
        <BarraNavegacaoAdmin />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  field: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: "#111", marginBottom: 6, fontWeight: "700" },
  dateButton: { height: 44, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#FFF" },
  dateButtonText: { fontSize: 15, color: "#333" },
  option: { height: 44, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionActive: { borderColor: "#2FA11D", backgroundColor: "#F3FDF1" },
  optionText: { fontSize: 15, color: "#444" },
  optionTextActive: { fontWeight: "600", color: "#2FA11D" },
  button: { marginTop: 10, height: 48, backgroundColor: "#2FA11D", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  barraFixa: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF" }
})