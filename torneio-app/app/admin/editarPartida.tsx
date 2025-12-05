import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import BarraNavegacaoAdmin from "../../components/BarraNavegacaoAdmin";
import { api } from "../../src/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditarPartida() {
  // captura segura do id (corrige caso venha como array)
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // estados
  const [idTorneio, setIdTorneio] = useState<string>("");
  const [fase, setFase] = useState<string>("");
  const [status, setStatus] = useState<string>("PENDENTE");
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());

  const [listaTorneios, setListaTorneios] = useState<any[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const fasesDisponiveis: string[] = [
    "GRUPOS",
    "OITAVAS_DE_FINAL",
    "QUARTAS_DE_FINAL",
    "SEMI_FINAL",
    "FINAL",
  ];

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        Alert.alert("Erro", "ID da partida não recebido");
        setLoading(false);
        return;
      }

      try {
        // GET torneios e partida (observa template string correto)
        const [resTorneios, resPartida] = await Promise.all([
          api.get("/torneio"),
          api.get(`/partidas/${id}`),
        ]);

        // compatibilidade com formatos diferentes do backend
        const torneios: any[] =
          resTorneios.data?.data || resTorneios.data || [];
        setListaTorneios(torneios);

        const partida: any = resPartida.data || {};

        if (partida.id_torneio) setIdTorneio(String(partida.id_torneio));
        if (partida.fase) setFase(partida.fase);
        if (partida.status) setStatus(partida.status);

        if (partida.horario) {
          const data = new Date(partida.horario);
          if (!isNaN(data.getTime())) setDataSelecionada(data);
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados", error?.response?.data || error);
        const erroMsg =
          error?.response?.data?.error ||
          "Não foi possível carregar os dados da partida.";
        Alert.alert("Erro", erroMsg);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event?.type === "dismissed" || !selectedDate) return;

    const novaData = new Date(dataSelecionada);
    novaData.setFullYear(selectedDate.getFullYear());
    novaData.setMonth(selectedDate.getMonth());
    novaData.setDate(selectedDate.getDate());
    setDataSelecionada(novaData);

    if (Platform.OS === "ios" && showDatePicker) setShowDatePicker(false);
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (event?.type === "dismissed" || !selectedDate) return;

    const novaData = new Date(dataSelecionada);
    novaData.setHours(selectedDate.getHours());
    novaData.setMinutes(selectedDate.getMinutes());
    setDataSelecionada(novaData);

    if (Platform.OS === "ios" && showTimePicker) setShowTimePicker(false);
  };

  // correção: retornar cedo se idSelected falsy, depois setar
  function selecionarTorneio(idSelected: string | number | undefined) {
    if (!idSelected) return;
    setIdTorneio(String(idSelected));
  }

  async function editarPartida() {
    if (!idTorneio) {
      Alert.alert("Atenção", "Selecione um torneio");
      return;
    }
    if (!fase) {
      Alert.alert("Atenção", "Selecione uma fase");
      return;
    }

    setSaving(true);
    try {
      // manter o mesmo endpoint do código que funciona
      await api.patch(`/partidas/edit/${id}`, {
        id_torneio: idTorneio,
        fase,
        status,
        horario: dataSelecionada.toISOString(),
      });

      Alert.alert("Sucesso", "Partida atualizada! ✅", [
        { text: "OK", onPress: () => router.replace("/admin/homeAdmin") },
      ]);
    } catch (error: any) {
      console.error("Erro ao editar partida:", error?.response?.status, error?.response?.data);
      let errorMessage = "Erro ao salvar alterações.";
      const statusErro = error?.response?.status;
      const msgBackend = error?.response?.data?.message || error?.response?.data?.error;

      if (statusErro === 404) errorMessage = "Partida ou Recurso não encontrado.";
      else if (msgBackend) errorMessage = String(msgBackend);

      Alert.alert("Erro", errorMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#2FA11D" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Partida</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Torneio</Text>
          {listaTorneios.length === 0 ? (
            <Text style={styles.semDados}>Nenhum torneio disponível.</Text>
          ) : (
            listaTorneios.map((item: any, index: number) => {
              const idReal = item.id_torneio || item.id || item._id || index;
              const isSelected = String(idTorneio) === String(idReal);

              if (!idReal) return null;

              return (
                <TouchableOpacity
                  key={String(idReal)}
                  style={[styles.option, isSelected && styles.optionActive]}
                  onPress={() => selecionarTorneio(idReal)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {item.nome || `Torneio ${index + 1}`}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color="#2FA11D" />}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>{dataSelecionada.toLocaleDateString("pt-BR")}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Horário</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateButtonText}>
                {dataSelecionada.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker value={dataSelecionada} mode="date" display="default" onChange={onChangeDate} />
        )}
        {showTimePicker && (
          <DateTimePicker value={dataSelecionada} mode="time" is24Hour={true} display="default" onChange={onChangeTime} />
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Fase</Text>
          {fasesDisponiveis.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, fase === item && styles.optionActive]}
              onPress={() => setFase(item)}
            >
              <Text style={[styles.optionText, fase === item && styles.optionTextActive]}>
                {item.replace(/_/g, " ")}
              </Text>
              {fase === item && <Ionicons name="checkmark" size={18} color="#2FA11D" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status Atual</Text>
          <View style={[styles.option, { justifyContent: "flex-start", backgroundColor: "#F0F0F0", borderColor: "#CCC" }]}>
            <Text style={styles.optionText}>{status}</Text>
          </View>
          <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            Para mudar o status para "EM_ANDAMENTO" ou "FINALIZADA", use os endpoints específicos.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (saving || !idTorneio || !fase) && styles.buttonDisabled]}
          disabled={saving || !idTorneio || !fase}
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
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  field: { marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 12, color: "#111", marginBottom: 6, fontWeight: "700" },
  dateButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  dateButtonText: { fontSize: 15, color: "#333" },
  option: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionActive: { borderColor: "#2FA11D", backgroundColor: "#F3FDF1" },
  optionText: { fontSize: 15, color: "#444" },
  optionTextActive: { fontWeight: "600", color: "#2FA11D" },
  button: { marginTop: 10, height: 48, backgroundColor: "#2FA11D", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonDisabled: { opacity: 0.5, backgroundColor: "#ccc" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  barraFixa: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF" },
  containerLoading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  semDados: { textAlign: "left", color: "#999", fontStyle: "italic", paddingVertical: 10 },
});