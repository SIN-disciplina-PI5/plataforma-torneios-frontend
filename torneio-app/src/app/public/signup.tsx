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
import colors from "../../../constants/colors";
// import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);

    // Exemplo com Supabase
    // const { error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });

    // if (error) {
    //   Alert.alert("Erro", error.message);
    //   setLoading(false);
    //   return;
    // }

    setLoading(false);
    router.replace("/public/login");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
          <Image
            source={require("../../../assets/images/ArenaLogo.jpg")}
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
                value={name}
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
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>
                  {loading ? "Carregando..." : "Cadastrar"}
                </Text>
              </Pressable>

              <Link href="/public/login">
                <Text style={styles.link}>
                  Já possui uma conta? Clique aqui para logar
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
    padding: 8,
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
    marginTop: 18,
    textAlign: "center",
    color: "#1e40af",
    fontSize: 15,
    fontWeight: "500",

  },
});
