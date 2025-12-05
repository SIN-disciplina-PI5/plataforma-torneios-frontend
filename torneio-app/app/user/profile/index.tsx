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
    Alert,
    ActivityIndicator,
} from "react-native";
import NavBar from "../../../components/BarraNavegacao";
import colors from "../../../constants/colors";
import { api } from "../../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function UserPerfil() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState("");
    const [tag, setTag] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [patente, setPatente] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            
            // 1. Verificar token
            const token = await AsyncStorage.getItem("token");
            
            if (!token) {
                Alert.alert(
                    "Não autenticado",
                    "Faça login para acessar seu perfil",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/user/login")
                        }
                    ]
                );
                return;
            }
            
            console.log("Token encontrado:", token.substring(0, 20) + "...");
            
            // 2. Decodificar token JWT para obter informações
            let decodedToken: any = null;
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    decodedToken = payload;
                    console.log("Payload do token:", payload);
                    
                    // Extrair informações do token
                    if (payload.id) {
                        setUserId(payload.id);
                        console.log("ID do usuário do token:", payload.id);
                    }
                    
                    if (payload.email && !email) {
                        setEmail(payload.email);
                    }
                    
                    if (payload.role) {
                        setRole(payload.role);
                    }
                }
            } catch (tokenError) {
                console.log("Erro ao decodificar token:", tokenError);
            }
            
            // 3. Tentar obter dados completos do usuário da API
            if (userId) {
                try {
                    console.log("Buscando dados do usuário ID:", userId);
                    const response = await api.get(`/api/users/${userId}`, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    
                    console.log("Resposta de /api/users/:id:", response.data);
                    
                    if (response.data) {
                        const user = response.data;
                        updateUserState(user);
                    }
                } catch (userError: any) {
                    console.log("Erro ao buscar dados do usuário:", userError.message);
                    // Se der erro, continuamos com dados básicos
                }
            }
            
            // 4. Se não conseguimos dados da API, usar dados salvos do AsyncStorage
            if (!fullName && !userData) {
                try {
                    const savedUserData = await AsyncStorage.getItem("userData");
                    if (savedUserData) {
                        const parsedData = JSON.parse(savedUserData);
                        console.log("Dados salvos do AsyncStorage:", parsedData);
                        
                        // Verificar estrutura do signup
                        if (parsedData.novoUsuario) {
                            updateUserState(parsedData.novoUsuario);
                        }
                        // Verificar se são dados diretos
                        else if (parsedData.nome) {
                            updateUserState(parsedData);
                        }
                        // Verificar se é a resposta completa do signup
                        else if (parsedData.data && parsedData.data.novoUsuario) {
                            updateUserState(parsedData.data.novoUsuario);
                        }
                    }
                } catch (storageError) {
                    console.log("Erro ao ler dados do AsyncStorage:", storageError);
                }
            }
            
            // 5. Se ainda não temos userId, tentar do AsyncStorage
            if (!userId) {
                const savedUserId = await AsyncStorage.getItem("userId");
                if (savedUserId) {
                    setUserId(savedUserId);
                }
            }
            
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
        } finally {
            setLoading(false);
        }
    };

    const updateUserState = (user: any) => {
        setFullName(user.nome || "");
        setEmail(user.email || "");
        setPatente(user.patente || "Sem patente");
        setCreatedAt(user.createdAt || "");
        if (!userId) setUserId(user.id_usuario || user.id);
        setRole(user.role || role);
        setUserData(user);
        
        // Campos opcionais
        if (user.tag) setTag(user.tag);
        if (user.username) setUsername(user.username);
        if (user.telefone) setPhone(user.telefone);
    };

    const handleSaveChanges = async () => {
        // Validações
        if (!fullName.trim()) {
            Alert.alert("Erro", "O nome é obrigatório");
            return;
        }
        
        if (!email.trim()) {
            Alert.alert("Erro", "O email é obrigatório");
            return;
        }
        
        if (password && password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }
        
        if (password && password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }

        try {
            setSaving(true);
            
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
                router.replace("/user/login");
                return;
            }

            // Obter userId atual
            let currentUserId = userId;
            if (!currentUserId) {
                try {
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        currentUserId = payload.id;
                    }
                } catch (error) {
                    console.log("Erro ao decodificar token:", error);
                }
            }
            
            if (!currentUserId) {
                Alert.alert("Erro", "ID do usuário não encontrado");
                return;
            }

            console.log("Atualizando usuário ID:", currentUserId);
            
            // Preparar dados para envio
            const updateData: any = {
                nome: fullName,
                email: email,
            };
            
            // Adicionar campos opcionais se preenchidos
            if (tag) updateData.tag = tag;
            if (username) updateData.username = username;
            if (phone) updateData.telefone = phone;
            if (password) updateData.senha = password;

            console.log("Dados de atualização:", updateData);

            // Fazer requisição de atualização
            const response = await api.patch(
                `/api/users/edit/${currentUserId}`,
                updateData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            
            console.log("Resposta da atualização:", response.data);
            
            // Atualizar dados locais
            const updatedUserData = {
                ...userData,
                ...updateData,
                id_usuario: currentUserId,
                role: role
            };
            
            // Salvar dados atualizados
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
            setUserData(updatedUserData);
            
            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            
            // Limpar campos de senha
            setPassword("");
            setConfirmPassword("");
            
            // Recarregar dados
            loadUserData();
            
        } catch (error: any) {
            console.error("Erro ao atualizar perfil:", error);
            
            let errorMessage = "Erro ao atualizar perfil";
            
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Dados:", error.response.data);
                
                if (error.response.status === 401) {
                    errorMessage = "Sessão expirada. Faça login novamente.";
                    await AsyncStorage.removeItem("token");
                    router.replace("/user/login");
                } else if (error.response.status === 404) {
                    errorMessage = "Usuário não encontrado no servidor";
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }
            
            Alert.alert("Erro", errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Erro", "Sessão expirada");
                router.replace("/user/login");
                return;
            }

            // Obter userId
            let currentUserId = userId;
            if (!currentUserId) {
                const savedUserId = await AsyncStorage.getItem("userId");
                if (savedUserId) {
                    currentUserId = savedUserId;
                }
            }
            
            if (!currentUserId) {
                Alert.alert("Erro", "ID do usuário não encontrado");
                return;
            }

            console.log("Deletando conta ID:", currentUserId);
            
            // Fazer requisição para deletar
            await api.delete(`/api/users/delete/${currentUserId}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            
            // Limpar todos os dados locais
            await AsyncStorage.multiRemove(["token", "userId", "userData"]);
            
            setShowDeleteModal(false);
            
            Alert.alert("Sucesso", "Conta deletada com sucesso!");
            router.replace("/user/login");
            
        } catch (error: any) {
            console.error("Erro ao deletar conta:", error);
            
            let errorMessage = "Erro ao deletar conta";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert("Erro", errorMessage);
        }
    };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            
            // Tentar fazer logout na API
            if (token) {
                try {
                    await api.post('/api/users/logout', {}, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                } catch (logoutError) {
                    console.log("Erro no logout da API:", logoutError);
                }
            }
            
            // Limpar dados locais
            await AsyncStorage.multiRemove(["token", "userId", "userData"]);
            
            Alert.alert("Sucesso", "Logout realizado!");
            router.replace("/user/login");
            
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            Alert.alert("Erro", "Erro ao fazer logout");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Data não disponível";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR').substring(0, 5);
        } catch (error) {
            return dateString;
        }
    };

    const getRoleText = () => {
        switch(role) {
            case "ADMIN": return "Administrador";
            case "USER": return "Jogador";
            default: return "Usuário";
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.greenSuccess} />
                    <Text style={styles.loadingText}>Carregando perfil...</Text>
                </View>
                <NavBar />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER COM IMAGEM COVER */}
            <View style={styles.headerImageContainer}>
                <Image
                    source={require("../../../assets/images/Cover.png")}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
            </View>

            {/* Avatar sobreposto */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                    <Image
                        style={styles.avatar}
                        source={require("../../../assets/images/profile.jpg")}
                    />
                </View>
            </View>

            {/* Informações do perfil */}
            <View style={styles.profileInfo}>
                <Text style={styles.name}>{fullName || "Usuário"}</Text>
                <Text style={styles.handle}>{email || "email@exemplo.com"}</Text>
                <Text style={styles.patentText}>{patente || "Sem patente"}</Text>
                <Text style={[styles.roleText, role === "ADMIN" ? styles.adminRole : styles.userRole]}>
                    {getRoleText()}
                </Text>
                
                {/* Group332 abaixo do texto */}
                <Image
                    source={require("../../../assets/images/Group 332.png")}
                    style={styles.group332}
                    resizeMode="contain"
                />
            </View>

            {/* Formulário */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    <Text style={styles.label}>Nome completo *</Text>
                    <TextInput 
                        style={styles.input} 
                        value={fullName} 
                        onChangeText={setFullName}
                        placeholder="Digite seu nome completo"
                    />

                    <Text style={styles.label}>Tag (apelido no jogo)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={tag} 
                        onChangeText={setTag}
                        placeholder="Ex: PlayerOne"
                    />

                    <Text style={styles.label}>Username</Text>
                    <TextInput 
                        style={styles.input} 
                        value={username} 
                        onChangeText={setUsername}
                        placeholder="Escolha um nome de usuário"
                    />

                    <Text style={styles.label}>Número de telefone</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="(00) 00000-0000"
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder="seu@email.com"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Nova Senha (deixe em branco para não alterar)</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Mínimo 6 caracteres"
                    />

                    <Text style={styles.label}>Confirmar Nova Senha</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="Confirme a nova senha"
                    />

                    {/* Informações da conta */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Informações da Conta</Text>
                        <Text style={styles.infoText}>
                            ID: {userId ? `${userId.substring(0, 8)}...` : "Não disponível"}
                        </Text>
                        <Text style={styles.infoText}>
                            Conta criada: {formatDate(createdAt)}
                        </Text>
                        <Text style={styles.infoText}>
                            Última atualização: {formatDate(userData?.updatedAt || "")}
                        </Text>
                        <Text style={styles.infoText}>
                            Tipo: {getRoleText()}
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.editButton, saving && styles.editButtonDisabled]} 
                        onPress={handleSaveChanges}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.editButtonText}>Salvar Alterações</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>SAIR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal de confirmação */}
            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconCircle}>
                            <Text style={styles.modalIcon}>!</Text>
                        </View>
                        <Text style={styles.modalTitle}>Deletar Conta?</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja deletar sua conta permanentemente?
                            Todos os seus dados serão perdidos.
                            Esta ação não pode ser desfeita.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancel}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirm}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={styles.modalConfirmText}>Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            {/* NAVBAR FIXA */}
            <NavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.white },
    
    headerImageContainer: {
        width: "100%",
        height: 120,
        backgroundColor: colors.greenBrand || "#2f6b3b",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    
    headerImage: {
        width: "100%",
        height: 120,
    },

    avatarContainer: {
        alignItems: "center",
        marginTop: -55,
        zIndex: 2,
    },
    
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
        position: "relative",
    },
    
    avatar: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
    },

    group332: {
        width: 72,
        height: 72,
        marginTop: 14,
        alignSelf: "center",
    },

    profileInfo: {
        alignItems: "center",
        marginTop: 8,
        marginBottom: 16,
    },
    
    name: { 
        fontSize: 20, 
        fontWeight: "700", 
        marginTop: 8,
        color: "#000"
    },
    
    handle: { 
        color: colors.textLabel || "#808280", 
        marginTop: 4,
        fontSize: 14
    },
    
    patentText: { 
        color: colors.error || "#e9473b", 
        fontWeight: "700", 
        fontSize: 14, 
        marginTop: 8,
    },
    
    roleText: {
        fontWeight: "600",
        fontSize: 13,
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    
    adminRole: {
        backgroundColor: colors.greenBrand + "20",
        color: colors.greenBrand,
    },
    
    userRole: {
        backgroundColor: colors.basic + "20",
        color: colors.basic,
    },

    form: { 
        padding: 20 
    },
    
    label: { 
        color: colors.textLabel || "#808280", 
        marginBottom: 6, 
        marginTop: 12,
        fontSize: 14,
        fontWeight: '500'
    },
    
    input: {
        borderWidth: 1,
        borderColor: colors.cardStroke || "#b3b3b3",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.cardBackground || "#f3f3f3",
        fontSize: 16,
    },

    infoBox: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 8,
    },
    
    infoText: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 4,
    },

    editButton: {
        marginTop: 18,
        backgroundColor: colors.greenSuccess || "#2fa026",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    
    editButtonDisabled: {
        backgroundColor: '#a0a0a0',
        opacity: 0.7,
    },
    
    editButtonText: { 
        color: colors.white, 
        fontWeight: "700",
        fontSize: 16,
    },

    deleteButton: {
        marginTop: 12,
        backgroundColor: colors.error || "#e9473b",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    
    deleteButtonText: { 
        color: colors.white, 
        fontWeight: "700",
        fontSize: 16,
    },

    logoutButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.advanced || "#dc6969",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    
    logoutButtonText: { 
        color: colors.advanced || "#dc6969", 
        fontWeight: "700",
        fontSize: 16,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    
    modalCard: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },

    modalIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.error || "#e9473b",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    
    modalIcon: { 
        fontSize: 24, 
        color: colors.white, 
        fontWeight: "700" 
    },

    modalTitle: { 
        fontSize: 20, 
        fontWeight: "700", 
        marginBottom: 8,
        color: '#333'
    },
    
    modalMessage: {
        textAlign: "center",
        color: colors.textLabel || "#808280",
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },

    modalActions: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    
    modalCancel: {
        flex: 1,
        marginRight: 8,
        backgroundColor: colors.greenSuccess || "#2fa026",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    
    modalCancelText: { 
        color: colors.white, 
        fontWeight: "700",
        fontSize: 14,
    },

    modalConfirm: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: colors.error || "#e9473b",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    
    modalConfirmText: { 
        color: colors.white, 
        fontWeight: "700",
        fontSize: 14,
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textLabel,
    },
});