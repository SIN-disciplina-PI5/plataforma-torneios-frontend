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
import { Link } from "expo-router";
import { api } from "@/src/services/api";
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import colors from "@/constants/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setsenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");


  async function handleLogin() {
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email,
        senha
      });

      setLoading(false);

      // Axios só chega no "try" quando a requisição é bem-sucedida (status 2xx)
      const data = response.data;

      if (!data?.token) {
        Alert.alert("Erro", "Token não encontrado na resposta");
        return;
      }

      await AsyncStorage.setItem("token", data.token);

      router.replace("/user/home");
    } catch (error: any) {
      setLoading(false);

      const mensagem =
        error?.response?.data?.message ||
        "Email ou senha inválidos ou erro na requisição";

      console.log("Enviando:", { name, email, senha });

      Alert.alert("Erro", mensagem);

    }
  }
  const admin = () => router.replace("../../admin/loginAdmin");

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Image
          source={require("@/assets/images/ArenaLogo.jpg")}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.form}>
            <Text style={styles.title}>Login</Text>

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

            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>


            <Link href="/user/signup">
              <Text style={{
                textAlign: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: "500",
              }}>  Não possui uma conta? </Text>
              <Text style={styles.link}>
                Cadastre-se
              </Text>
            </Link>

          
              <Pressable style={styles.buttonAdmin} onPress={admin}>
               <Text style={styles.buttonText}>Admin</Text>
             </Pressable>

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

  profileImage: {
    width: "100%",
    height: 220,

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
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "#CBD5E1",
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
   buttonAdmin: {
    backgroundColor: colors.greenSuccess,
    alignItems: "center",
    width: "20%",
    display: "flex",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 200,
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
    fontSize: 15,
    fontWeight: "500",
    color: colors.greenSuccess,
  },
});
