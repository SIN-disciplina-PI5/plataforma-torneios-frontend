import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Alert,
    Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { api } from "../../src/services/api";
import NavBar from "../../components/BarraNavegacaoAdmin";

export default function PartidasList() {
    const router = useRouter();
    const [partidas, setPartidas] = useState<any>([]);

    async function loadPartidas() {
        try {
            const res = await api.get("/partidas");
            
            const partidasOrdenadas = res.data.sort((a: any, b: any) => {
                if (!a.horario) return 1;
                if (!b.horario) return -1;
                
                const dataA = new Date(a.horario).getTime();
                const dataB = new Date(b.horario).getTime();
                
                return dataB - dataA;
            });
            
            setPartidas(partidasOrdenadas);
        } catch (err: any) {
            Alert.alert("Erro", "Erro ao carregar partidas");
        }
    }

    async function handleDeletePartida(id: string): Promise<void> {
        Alert.alert(
            "Confirmar Deleção",
            "Tem certeza que deseja deletar esta partida? Esta ação é irreversível.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/partidas/delete/${id}`);
                            
                            Alert.alert("Sucesso", "Partida deletada com sucesso!");
                            loadPartidas(); 
                        } catch (err: any) {
                            let errorMessage = "Ocorreu um erro desconhecido ao deletar a partida.";

                            if (err.response) {
                                const status = err.response.status;

                                if (status === 405) {
                                    errorMessage = "Falha: 405 Method Not Allowed. Verifique o vercel.json.";
                                } else if (status === 401) {
                                    errorMessage = "Falha: 401 Unauthorized. Seu token JWT expirou.";
                                } else if (status === 404) {
                                    errorMessage = `Rota não encontrada.`;
                                } else {
                                    errorMessage = `Falha na API: Status ${status}.`;
                                }
                            } else if (err.request) {
                                errorMessage = "Não foi possível conectar ao servidor.";
                            } else {
                                errorMessage = "Falha interna ao preparar a requisição.";
                            }

                            Alert.alert("Erro de Deleção", errorMessage);
                        }
                    }
                }
            ]
        );
    }

    useEffect(() => {
        loadPartidas();
    }, []);

    const formatMatchTime = (horario: string | null) => {
        if (!horario) return { dateText: '--/--', timeText: '--:--', isPast: true };

        const date = new Date(horario);
        const today = new Date();

        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today;

        const dateText = isToday
            ? 'Hoje'
            : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const timeText = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return { dateText, timeText, isPast };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá, Admin</Text>
            
            <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Partidas</Text>
            </View>

            <ScrollView 
                style={styles.list} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                {partidas.map((p: any) => {
                    const { dateText, timeText, isPast } = formatMatchTime(p.horario);

                    return (
                        <View 
                            key={p.id_partida} 
                            style={[
                                styles.matchRow,
                                isPast && styles.pastMatchRow
                            ]}
                        >
                            <View style={styles.dateTimeCol}>
                                <Text style={[
                                    styles.dateText,
                                    isPast && styles.pastDateText
                                ]}>
                                    {dateText}
                                </Text>
                                <Text style={[
                                    styles.timeText,
                                    isPast && styles.pastTimeText
                                ]}>
                                    {timeText}
                                </Text>
                            </View>

                            <View style={styles.matchDetails}>
                                <Text 
                                    style={styles.torneioTitle}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {p.Torneio?.nome || "Sem torneio"}
                                </Text>

                                <View style={styles.detailLine}>
                                    <Text style={styles.detailText}>
                                        Fase: <Text style={{ fontWeight: 'bold' }}>{p.fase}</Text>
                                    </Text>
                                    <Text style={styles.detailText}> | </Text>
                                    <Text style={styles.detailText}>
                                        Status: <Text style={{ fontWeight: 'bold' }}>{p.status}</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.acoesContainer}>
                                <TouchableOpacity
                                    style={styles.acaoButton}
                                    onPress={() => router.push({
                                        pathname: "/admin//editarPartida",
                                        params: { id: p.id_partida } // ID vai como parametro[, não na URL]
                                    })}
                                >
                                    <Ionicons name="pencil-outline" size={16} color="#666666" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.acaoButton}
                                    onPress={() => handleDeletePartida(p.id_partida)}
                                >
                                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <TouchableOpacity 
                style={styles.novaPartidaButton}
                onPress={() => router.push("/admin/criarPartida")}
            >
                <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.novaPartidaButtonText}>Nova Partida</Text>
            </TouchableOpacity>

            <NavBar />
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 30,
        marginLeft: 20,
        color: "#0A4438",
    },
    subtitleContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#2D2D2D",
    },
    list: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 10,
        paddingBottom: 140,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F3F3F3",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        minHeight: 85,
        maxHeight: 85,
        elevation: 1,
        width: width - 20,
    },
    pastMatchRow: {
        backgroundColor: "#F8F8F8",
        opacity: 0.8,
    },
    dateTimeCol: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 6,
        marginRight: 10,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#37A51E',
        marginBottom: 2,
    },
    pastDateText: {
        color: '#888888',
    },
    timeText: {
        fontSize: 12,
        color: '#444',
    },
    pastTimeText: {
        color: '#777777',
    },
    matchDetails: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        maxWidth: width - 160,
    },
    torneioTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#0A5A3A",
        marginBottom: 4,
        flexShrink: 1,
        lineHeight: 20,
    },
    detailLine: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    detailText: {
        fontSize: 13,
        color: '#555',
    },
    acoesContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 'auto',
    },
    acaoButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8
    },
    novaPartidaButton: {
        position: "absolute",
        bottom: 68,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3FDF1",
        borderWidth: 1,
        borderColor: "#4CAF50",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        zIndex: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    novaPartidaButtonText: {
        color: "#4CAF50",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8
    },
});