import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";
import { Alert } from "react-native";
import colors from "../../constants/colors";


// import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [nome, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setsenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
  setLoading(true);

  try {
    //
  const response = await api.post("/users/signup", {
  nome,
  email,
  senha,
}); 


    setLoading(false);

    Alert.alert(
      "Sucesso",
      "Conta criada com sucesso!"
    );

    router.replace("/user/login");
  } catch (error: any) {
    setLoading(false);

    const mensagem =
      error?.response?.data?.message ||
      "Não foi possível criar a conta";

      console.log("Enviando:", { nome, email, senha });

    Alert.alert("Erro", mensagem);
  }
}



  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
          <Image
            source={require("@/assets/images/ArenaLogo.jpg")}
            style={styles.profileImage}
            resizeMode="cover"
          />
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.white }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>


            <View style={styles.form}>
              <Text style={styles.title}>Cadastro</Text>

              <Text style={styles.label}>Nome de usuário</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setName}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                placeholder="Digite sua senha"
                style={styles.input}
                value={senha}
                onChangeText={setsenha}
                secureTextEntry
              />

              <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>
                  {loading ? "Carregando..." : "Cadastrar"}
                </Text>
              </Pressable>

              <Link href="/user/login">
               <Text style={{
                              textAlign: "center",
                              justifyContent: "center",
                              fontSize: 15,
                              fontWeight: "500",
                            }}>  Já possui uma conta? </Text>
                            <Text style={styles.link}>
                              Entrar
                            </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },

  container: {
    width: "100%",
  },

  backButton: {
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },

  profileImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 25,
  },

  form: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
  },

  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },

  input: {
    height: 50,
    borderColor: "#94a3b8",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#2FA026",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: colors.greenSuccess,
    fontSize: 15,
    fontWeight: "500",

  },
});
