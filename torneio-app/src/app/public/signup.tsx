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
} from "react-native";
import { Link, router } from "expo-router";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

export default function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSingUp() {
        setLoading(true);

        // Exemplo Supabase (você ativa quando configurar)
        // const { error } = await supabase.auth.signUp({
        //     email,
        //     password,
        // });

        // if (error) {
        //     Alert.alert('Erro', error.message);
        //     setLoading(false);
        //     return;
        // }

        setLoading(false);
        router.replace('/public/login');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                style={{ flex: 1, backgroundColor: colors.white }} 
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.container}>

                    <Pressable 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>

                    <View style={styles.header}>
                        <Image
                            source={require("../../../assets/images/ArenaLogo.jpg")}
                            style={styles.profileImage}
                        />

                        <View style={styles.form}>
                            <Text style={styles.title}>Cadastro</Text>

                            <Text style={styles.paragraph}>Nome de usuário:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome de usuário"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.paragraph}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu email"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.paragraph}>Senha:</Text>
                            <TextInput
                                placeholder="Digite sua senha"
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <Pressable style={styles.button} onPress={handleSingUp}>
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
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
    form: {
        width: "100%",
    },
    profileImage: {
        width: "100%",
        height: 242,
        marginBottom: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
        textAlign: "left",
        marginBottom: 20,
    },
    paragraph: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
        lineHeight: 24,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#94a3b8",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#2FA026",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        backgroundColor: "rgba(0,0,0,0.20)",
        alignSelf: "flex-start",
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    link: {
        marginTop: 15,
        textAlign: "center",
        color: "#1e40af",
        fontSize: 14,
    },
});
