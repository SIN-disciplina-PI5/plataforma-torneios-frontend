import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import BarraNavegacaoAdmin from "../../components/BarraNavegacaoAdmin" 
import { api } from '../../src/services/api'
import { useRouter } from "expo-router"

export default function CriarPartida() {
  const [idTorneio, setIdTorneio] = useState("")
  const [fase, setFase] = useState("GRUPOS")

  const [listaTorneios, setListaTorneios] = useState([])

  // Estados separados para Data e Hora para evitar bugs
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const fasesDisponiveis = ["GRUPOS", "OITAVAS", "QUARTAS", "SEMIFINAL", "FINAL"]
  const router = useRouter()

  useEffect(() => {
    async function carregarTorneios() {
      try {
        const response = await api.get("/torneio")
        setListaTorneios(response.data)

      } 
      catch (error) {
        console.log("Erro ao buscar torneios", error)
        Alert.alert("Erro", "Não foi possível carregar os torneios.")
      }
    }
    carregarTorneios()
  }, [])

  // Função para selecionar Data
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false) 
    }
    if (selectedDate) {
      // Mantém a hora atual, muda apenas o dia/mês/ano
      const novaData = new Date(dataSelecionada)
      novaData.setFullYear(selectedDate.getFullYear())
      novaData.setMonth(selectedDate.getMonth())
      novaData.setDate(selectedDate.getDate())
      setDataSelecionada(novaData)
    }
  }

  // Função para selecionar Hora
  const onChangeTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false)
    }
    if (selectedDate) {
      // Mantém o dia atual, muda apenas hora/minuto
      const novaData = new Date(dataSelecionada)
      novaData.setHours(selectedDate.getHours())
      novaData.setMinutes(selectedDate.getMinutes())
      setDataSelecionada(novaData)
    }
  }
  
function selecionarTorneio(id: any) {
  const idString = String(id)
  
  // Se já está selecionado, desmarca
  if (idTorneio === idString) {
    setIdTorneio("")
  } else {
    // Seleciona o novo
    setIdTorneio(idString)
  }
}

  async function criarPartida() {
    if (!idTorneio) {
      Alert.alert("Atenção", "Selecione um torneio.")
      return
    }

    try {

      await api.post("/partidas", {
        id_torneio: idTorneio,
        fase: fase,
        status: "PENDENTE",
        horario: dataSelecionada.toISOString()
      })

      Alert.alert("Sucesso", "Partida criada com sucesso ✅", [
        { text: "OK", onPress: () => router.replace("/admin/partidas/partidas") }
      ])

    } catch (error: any) {
      console.log(error.response?.data || error.message)
      Alert.alert("Erro", "Não foi possível criar a partida.")
    }
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.title}>Criar Partida</Text>

        {/* --- SELEÇÃO DE TORNEIO --- */}
        <View style={styles.field}>
          <Text style={styles.label}>Selecione o Torneio</Text>
          
          {listaTorneios.length === 0 && (
             <Text style={styles.loadingText}>Carregando torneios...</Text>
          )}

          {listaTorneios.map((item: any, index) => {
            // LÓGICA DE PROTEÇÃO: Tenta pegar id, _id, id_torneio ou usa o index como último recurso
            const idReal = item.id || item._id || item.id_torneio || index;
            
            // LÓGICA DE COMPARAÇÃO: Converte ambos para string antes de comparar
            const isSelected = String(idTorneio) === String(idReal) && idTorneio !== "";

            return (
              <TouchableOpacity
                key={idReal} // A chave única 
                style={[
                  styles.option,
                  isSelected && styles.optionActive // Só fica verde se o ID bater
                ]}
                onPress={() => selecionarTorneio(idReal)}
              >
                <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextActive
                  ]}>
                  {item.nome || `Torneio ${index + 1}`}
                </Text>

                {isSelected && (
                  <Ionicons name="checkmark" size={18} color="#2FA11D" />
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* --- DATA E HORA (Botões Separados) --- */}
        <View style={styles.row}>
          {/* Botão DATA */}
          <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dataSelecionada.toLocaleDateString('pt-BR')}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botão HORA */}
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Horário</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dataSelecionada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickers (Invisíveis até serem chamados) */}
        {showDatePicker && (
          <DateTimePicker
            value={dataSelecionada}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dataSelecionada}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}

        {/* --- SELEÇÃO DE FASE --- */}
        <View style={styles.field}>
          <Text style={styles.label}>Fase da Competição</Text>
          {fasesDisponiveis.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                fase === item && styles.optionActive
              ]}
              onPress={() => setFase(item)}
            >
              <Text style={[
                  styles.optionText,
                  fase === item && styles.optionTextActive
                ]}>
                {item}
              </Text>
              {fase === item && (
                <Ionicons name="checkmark" size={18} color="#2FA11D" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* --- BOTÃO CONFIRMAR --- */}
        <TouchableOpacity
          style={[
            styles.button,
            !idTorneio && { opacity: 0.5, backgroundColor: "#ccc" } // Feedback visual claro
          ]}
          disabled={!idTorneio}
          onPress={criarPartida}
        >
          <Text style={styles.buttonText}>Agendar Partida</Text>
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
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20
  },
  field: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 12,
    color: "#111",
    marginBottom: 6,
    fontWeight: "700"
  },
  loadingText: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10
  },
  dateButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#FFF"
  },
  dateButtonText: {
    fontSize: 15,
    color: "#333"
  },
  option: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionActive: {
    borderColor: "#2FA11D",
    backgroundColor: "#F3FDF1"
  },
  optionText: {
    fontSize: 15,
    color: "#444"
  },
  optionTextActive: {
    fontWeight: "600",
    color: "#2FA11D"
  },
  button: {
    marginTop: 10,
    height: 48,
    backgroundColor: "#2FA11D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600"
  },
  barraFixa: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF"
  }
})