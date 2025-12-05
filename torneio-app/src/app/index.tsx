import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderTitle } from '@react-navigation/elements';
import { router } from 'expo-router';
import colors from '../../constants/colors';


export default function HomeScreen() {
  return (
    // SafeAreaView garante que o conteúdo não fique debaixo da status bar ou do notch

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao Arena Lagoa Beach</Text>
        <Text>Participe de torneios, acompanhe seu ranking e desafie amigos na areia</Text>
      </View>

      <Pressable
        style={{
          backgroundColor: colors.greenSuccess,
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={() => {
          router.push("/public/login"); 
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Vamos Competir
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

});