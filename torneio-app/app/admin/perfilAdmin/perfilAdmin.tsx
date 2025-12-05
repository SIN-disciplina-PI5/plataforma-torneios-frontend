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
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import NavBar from "../../../../components/BarraNavegacaoAdmin";
import colors from "../../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../services/api";
import { useRouter } from "expo-router";

export default function AdminPerfil() {
    const [id, setId] = useState<string | null>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        carregarPerfil();
    }, []);

    async function carregarPerfil() {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("@token");

            if (!token) {
                Alert.alert("Acesso restrito", "Faça login para continuar.");
                router.replace("/admin/loginAdmin");
                return;
            }

            const response = await api.get("/admin/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const dados = response.data.admin || response.data;

            setId(dados.id || dados._id || dados.id_usuario);
            setNome(dados.nome); 
            setEmail(dados.email);

        } catch (error: any) {
            console.log("Erro ao carregar perfil:", error.response?.status);
            if (error.response?.status === 401 || error.response?.status === 403) {
                Alert.alert("Sessão Expirada", "Por favor, faça login novamente.");
                await logout();
            } else {
                Alert.alert("Erro", "Não foi possível carregar seus dados.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function atualizarPerfil() {
        if (!id) {
            Alert.alert("Erro", "Usuário não identificado.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("@token");

            await api.patch(
                `/admin/edit/${id}`, 
                {
                    nome,
                    email,
                    senha: password || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert("Sucesso", "Perfil atualizado! ✅");
            setPassword(""); 

        } catch (error: any) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        }
    }

    async function deletarConta() {
        if (!id) return;

        try {
            const token = await AsyncStorage.getItem("@token");

            await api.delete(`/admin/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await logout(); 
            Alert.alert("Conta Deletada", "Sua conta foi excluída com sucesso.");

        } catch (error: any) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível deletar a conta.");
            setShowDeleteModal(false);
        }
    }

    async function logout() {
        await AsyncStorage.removeItem("@token");
        router.replace("/admin/loginAdmin");
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.greenBrand || "#2f6b3b"} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>ADMIN</Text>
                    </View>

                    <View style={styles.avatarSection}>
                        <View style={styles.avatarBorder}>
                            <Image
                                source={require("../../../../assets/images/fotoAdmin.jpg")}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.name}>{nome || "Admin"}</Text>
                        <Text style={styles.handle}>{email}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Admin</Text>
                        </View>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nome de Usuário</Text>
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Nova Senha (opcional)</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Digite apenas para alterar"
                        />

                        <TouchableOpacity style={styles.editButton} onPress={atualizarPerfil}>
                            <Text style={styles.editButtonText}>Salvar Alterações</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
                            <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                            <Text style={styles.logoutButtonText}>SAIR</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Tem certeza?</Text>
                        <Text style={styles.modalMessage}>
                            Essa ação excluirá permanentemente sua conta.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDeleteModal(false)}>
                                <Text style={styles.modalCancelText}>Cancelar</Text>
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
    
    scrollContainer: { 
        paddingBottom: 100,
        flexGrow: 1 
    },

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
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    avatar: { width: 100, height: 100, borderRadius: 50 },
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
        marginTop: 24,
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
    
    // Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#333' },
    modalMessage: { textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 16 },
    modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    modalCancel: { 
        flex: 1, 
        marginRight: 8, 
        backgroundColor: '#CCC', 
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    modalCancelText: { color: '#333', fontWeight: '700' },
    modalConfirm: { 
        flex: 1, 
        marginLeft: 8, 
        backgroundColor: colors.error || '#e9473b', 
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    modalConfirmText: { color: colors.white, fontWeight: '700' },
});