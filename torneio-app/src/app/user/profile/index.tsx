import React, { useState } from "react";
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
import NavBar from "../../../../components/BarraNavegacao";
import colors from "../../../../constants/colors";

export default function UserPerfil() {
    const [fullName, setFullName] = useState("Aline Soares Vieira");
    const [tag, setTag] = useState("O artilheiro");
    const [username, setUsername] = useState("aline-soares");
    const [phone, setPhone] = useState("123-456-7890");
    const [email, setEmail] = useState("aline@gmail.com");
    const [password, setPassword] = useState("********");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>ARTILHEIRO</Text>
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatarBorder}>
                        <Image
                            source={require("../../../../assets/images/profile.png")}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.name}>Mácio Bueno</Text>
                    <Text style={styles.handle}>@MarcinhopPvp</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Patente Mestre</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

                    <Text style={styles.label}>Tag</Text>
                    <TextInput style={styles.input} value={tag} onChangeText={setTag} />

                    <Text style={styles.label}>Username</Text>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} />

                    <Text style={styles.label}>Número de telefone</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

                    <Text style={styles.label}>Confirmar Senha</Text>
                    <TextInput style={styles.input} value={password} secureTextEntry />

                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
                        <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>SAIR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal de confirmação de exclusão */}
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
                        <Text style={styles.modalMessage}>Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.</Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDeleteModal(false)}>
                                <Text style={styles.modalCancelText}>Não, Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalConfirm} onPress={() => { setShowDeleteModal(false); /* implementar exclusão */ }}>
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

    