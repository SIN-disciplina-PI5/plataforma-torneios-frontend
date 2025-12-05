import React from "react";
import { View, Text, StyleSheet } from "react-native";
// Importa o componente da barra de navegação
import NavBar from "../../components/BarraNavegacao"; 


export default function UserHome() {
    return (
        // O estilo 'flex: 1' garante que a tela ocupe todo o espaço
        <View style={styles.container}>
            {/* Conteúdo principal da tela */}
            <View style={styles.content}>
                <Text style={styles.title}>Bem-vindo ao App!</Text>
                <Text style={styles.subtitle}>Sua Home está aqui.</Text>
                {/* Adicione mais conteúdo da tela principal aqui, se necessário. */}
            </View>
            
            {/* O componente NavBar será fixado na parte inferior devido aos seus estilos internos */}
            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Preenche toda a tela
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        paddingBottom: 70, // Adiciona padding para que o conteúdo não fique escondido pela NavBar
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    }
});