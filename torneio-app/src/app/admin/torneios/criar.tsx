import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import BarraNavegacaoAdmin from "../../../../components/BarraNavegacaoAdmin";

export default function CriarTorneio() {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("Intermediário")
  const [vagas, setVagas] = useState("")

  const categorias = ["Iniciante", "Intermediário", "Avançado"]

  return (
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
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>

        {categorias.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              categoria === item && styles.optionActive
            ]}
            onPress={() => setCategoria(item)}
          >
            <Text
              style={[
                styles.optionText,
                categoria === item && styles.optionTextActive
              ]}
            >
              {item}
            </Text>

            {categoria === item && (
              <Ionicons name="checkmark" size={18} color="#2FA11D" />
            )}
          </TouchableOpacity>
        ))}
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
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!nome || !vagas || Number(vagas) <= 0) && { opacity: 0.5 }
        ]}
        disabled={!nome || !vagas || Number(vagas) <= 0}
        onPress={() => {
          if (!nome || !vagas || Number(vagas) <= 0) return

          console.log({
            nome,
            categoria,
            vagas: Number(vagas)
          })
        }}
      >
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>

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

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20
  },

  field: {
    marginBottom: 20
  },

  label: {
    fontSize: 12,
    color: "#111",
    marginBottom: 6,
    fontWeight: "700",
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#FFF"
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
    marginTop: 30,
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
  }
})
