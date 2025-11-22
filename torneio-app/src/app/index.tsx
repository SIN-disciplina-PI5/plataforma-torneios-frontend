import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderTitle } from '@react-navigation/elements';
import {Link } from 'expo-router';


export default function HomeScreen() {
  return (
    // SafeAreaView garante que o conteúdo não fique debaixo da status bar ou do notch
     <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao Arena Lagoa Beach</Text>
        <Text>Participe de torneios, acompanhe seu ranking e desafie amigos na areia</Text>
      </View>
        <TouchableOpacity
                    style={{
                      backgroundColor: '#2FA026',
                      paddingVertical: 12,
                      paddingHorizontal: 32,
                      borderRadius: 8,
                      marginTop: 20,
                    }}
                    onPress={() => {
                     Linking.openURL('./screens/login');
                    }}
                  >
                    <Text style={{ color: '#ffffffff', fontSize: 16, fontWeight: 'bold' }}>Vamos Competir</Text>
                  </TouchableOpacity>
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
