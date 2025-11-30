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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    console.log({ email, password });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Image
          source={require("../../../assets/images/ArenaLogo.jpg")}
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>

            <Link href="/public/signup">
              <Text style={styles.link}>
                Não possui uma conta? Cadastre-se
              </Text>
            </Link>
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

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    marginTop: 18,
    textAlign: "center",
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "500",
  },
});
