import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";



export default function LoginScreen() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSingUp() {
    // logica de login, delmiro
    console.log({

    })

    return (
      // SafeAreaView garante que o conteúdo não fique debaixo da status bar ou do notch
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/images/ArenaLogo.jpg")}
            style={styles.profileImage}
          />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <View style={styles.form}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.paragraph}>Email </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  value="email"
                  onChangeText={setEmail}
                />
                <Text style={styles.paragraph}>Senha: </Text>
                <TextInput
                  placeholder="Digite sua senha"
                  style={styles.input}
                  value="password"
                  onChangeText={setPassword}
                  secureTextEntry // bolinha no lugar dos caracteres
                />

                <Pressable style={styles.button}>
                  <Text
                    style={{
                      color: "#ffffffff",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Entrar
                  </Text>
                </Pressable>

                <Link href="./auth/signup">
                  <Text style={styles.link}>
                    Não possui uma conta? Cadastre-se
                  </Text>
                </Link>

              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#ffff",
    },
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
      alignItems: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
    },
    form: {},
    profileImage: {
      width: "100%",
      height: 242,
      marginBottom: 15,
    },
    title: {
      position: "relative",
      marginRight: 220,
      fontSize: 32,
      fontWeight: "bold",
      color: "#000000ff",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 24,
      color: "#94a3b8",
      textAlign: "center",
      marginTop: 5,
    },
    section: {
      width: "100%",
      padding: 20,
      backgroundColor: "#1e293b",
      borderRadius: 15,
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#e2e8f0",
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#334155",
      paddingBottom: 10,
    },
    paragraph: {
      justifyContent: "flex-start",
      width: "100%",
      marginTop: 10,
      fontSize: 16,
      color: "#000000ff",
      lineHeight: 24,
    },
    paragraphlink: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: "100%",
      marginTop: 10,
      fontSize: 16,
      color: "#000",
      lineHeight: 24,
    },
    button: {
      backgroundColor: "#2FA026",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginTop: 20,
    },
    link: {
      marginTop: 10,
      textAlign: "center",

    },
    input: {
      width: "100%",
      height: 50,
      borderColor: "#94a3b8",
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
    },

    footerContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: "#334155",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0f172a",
    },
    footerText: {
      color: "#94a3b8",
      fontSize: 12,
    },
  })
};