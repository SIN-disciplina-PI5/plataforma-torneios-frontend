import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NavBar from "../../components/BarraNavegacao"; 


export default function UserHome() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Bem-vindo ao App!</Text>
                <Text style={styles.subtitle}>Sua Home está aqui.</Text>
            </View>
            
            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        paddingBottom: 70, 
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