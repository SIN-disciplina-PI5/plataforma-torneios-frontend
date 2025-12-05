import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
} from "react-native";
import NavBar from "../../../../components/BarraNavegacaoAdmin";
import colors from "../../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../services/api";
import { useRouter } from "expo-router";

export default function AdminPerfil() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        carregarPerfil();
    }, []);

    async function carregarPerfil() {
        try {
            const token = await AsyncStorage.getItem("@token");

            if (!token) {
                alert("Sessão expirada. Faça login novamente.");
                router.replace("/login-admin");
                return;
            }

            const response = await api.get("/admin/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsername(response.data.username);
            setPassword("");
        } catch (error: any) {
            console.log(error.response?.data || error.message);
            alert("Erro ao carregar perfil");
        }
    }

    async function atualizarPerfil() {
        try {
            const token = await AsyncStorage.getItem("@token");

            await api.put("/admin", {
                username,
                password,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Perfil atualizado ✅");
            setPassword("");
        } catch (error: any) {
            console.log(error.response?.data || error.message);
            alert("Erro ao atualizar perfil");
        }
    }

    async function deletarConta() {
        try {
            const token = await AsyncStorage.getItem("@token");

            await api.delete("/admin", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await AsyncStorage.removeItem("@token");

            alert("Conta deletada com sucesso 💣");
            router.replace("/login-admin");

        } catch (error: any) {
            console.log(error.response?.data || error.message);
            alert("Erro ao deletar conta");
        }
    }

    async function logout() {
        await AsyncStorage.removeItem("@token");
        router.replace("/login-admin");
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>ADMIN</Text>
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatarBorder}>
                        <Image
                            source={require("../../../../assets/images/fotoAdmin.jpg")}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.name}>{username || "Carregando..."}</Text>
                    <Text style={styles.handle}>@{username}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Admin</Text>
                    </View>
                </View>

                <View style={styles.form}>

                    <Text style={styles.label}>Username</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity style={styles.editButton} onPress={atualizarPerfil}>
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
                        <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutButtonText}>SAIR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconCircle}>
                            <Text style={styles.modalIcon}>?</Text>
                        </View>
                        <Text style={styles.modalTitle}>Deletar?</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDeleteModal(false)}>
                                <Text style={styles.modalCancelText}>Não, Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalConfirm} onPress={deletarConta}>
                                <Text style={styles.modalConfirmText}>Sim, Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <NavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.white },
    container: { paddingBottom: 90 },
    header: {
        height: 120,
        backgroundColor: colors.greenBrand || "#2f6b3b",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: { color: colors.white, fontSize: 28, fontWeight: "700" },
    avatarSection: { alignItems: "center", marginTop: -40, paddingHorizontal: 20 },
    avatarBorder: {
        width: 110,
        height: 110,
        borderRadius: 60,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: { width: 100, height: 100, borderRadius: 50, resizeMode: "cover" },
    name: { fontSize: 20, fontWeight: "700", marginTop: 8 },
    handle: { color: colors.textLabel || "#808280", marginTop: 4 },
    badge: {
        marginTop: 8,
        backgroundColor: colors.error || "#e9473b",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: { color: colors.white, fontWeight: "700" },
    form: { padding: 20 },
    label: { color: colors.textLabel || "#808280", marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: colors.cardStroke || "#b3b3b3",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.cardBackground || "#f3f3f3",
    },
    editButton: {
        marginTop: 18,
        backgroundColor: colors.greenSuccess || "#2fa026",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    editButtonText: { color: colors.white, fontWeight: "700" },
    deleteButton: {
        marginTop: 12,
        backgroundColor: colors.error || "#e9473b",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    deleteButtonText: { color: colors.white, fontWeight: "700" },
    logoutButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.advanced || "#dc6969",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    logoutButtonText: { color: colors.advanced || "#dc6969", fontWeight: "700" },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    modalIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.basic || '#fdb66a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    modalIcon: { fontSize: 20, color: colors.white, fontWeight: '700' },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    modalMessage: { textAlign: 'center', color: colors.textLabel || '#808280', marginBottom: 16 },
    modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    modalCancel: { flex: 1, marginRight: 8, backgroundColor: '#0a66d1', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
    modalCancelText: { color: colors.white, fontWeight: '700' },
    modalConfirm: { flex: 1, marginLeft: 8, borderWidth: 1, borderColor: colors.error || '#e9473b', paddingVertical: 10, borderRadius: 6, alignItems: 'center', backgroundColor: colors.white },
    modalConfirmText: { color: colors.error || '#e9473b', fontWeight: '700' },
});
