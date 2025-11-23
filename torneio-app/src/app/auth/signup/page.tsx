import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
} from "react-native";
import { Link } from "expo-router";
import colors from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { router } from "expo-router";


export default function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    async function handleSingUp() {
        // logica de cadastro, delmiro
        setLoading(true);

        // const {} = await supabase.auth.signUp({
        //     email: email,
        //     password: password,
        // })
        // if(Error){
        //     Alert.alert('Erro')
        //     setLoading(false);
        //     return;
        // }
        setLoading(false);
        router.replace('/screens/login');

    }

    return (
        // SafeAreaView garante que o conteúdo não fique debaixo da status bar ou do notch
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.container}>
                    <Pressable style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <View style={styles.header}>
                        <Image
                            source={require("../../../assets/images/ArenaLogo.jpg")}
                            style={styles.profileImage}
                        />
                        <View style={styles.form}>
                            <Text style={styles.title}>Cadastro</Text>
                            <Text style={styles.paragraph}>Nome de usuário: </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome de usuário"
                                value="name"
                                onChangeText={setName}
                            />
                            <Text style={styles.paragraph}>Email: </Text>
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

                            <Pressable style={styles.button} onPress={handleSingUp}>
                                <Text
                                    style={{
                                        color: "#ffffffff",
                                        fontSize: 16,
                                        fontWeight: "bold",
                                    }

                                    }
                                >
                                    Cadastrar
                                </Text>
                            </Pressable>

                            <Link href="./screens/login">
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
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.20',
        alignSelf: 'flex-start',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,

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
});
