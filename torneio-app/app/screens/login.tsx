import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
// import { DrawerSceneWrapper } from '../components/drawer-scene-wrapper';
// import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  return (
    // SafeAreaView garante que o conteúdo não fique debaixo da status bar ou do notch
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Image
                source={require('../../assets/images/ArenaLogo.jpg')}
                style={styles.profileImage}
                />

            <Text style={styles.title}>Login</Text>
            <Text style={styles.paragraph}>Nome de usuário: </Text>
              <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome de usuário"
                  />
            <Text style={styles.paragraph}>Senha: </Text>
              <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    />

            <TouchableOpacity
              style={{
                backgroundColor: '#0a7ea4',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={() => {
                // ação de login
              }}
            >
              <Text style={{ color: '#149e2bff', fontSize: 16, fontWeight: 'bold' }}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.paragraph}>Esqueceu sua senha? Registrar</Text>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>© 2025 Arena Lagoa Beach. Todos os direitos reservados.</Text>
        </View>
      </View>
     </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20, 
    alignItems: 'center', 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    borderWidth: 3,
    borderColor: '#38bdf8', 
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    width: '100%',
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#cbd5e1', 
    lineHeight: 24, 
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30, 
    marginTop: 10,
  },
    input: {    
    width: '100%',
    height: 50,
    borderColor: '#94a3b8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    },

  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155', 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a', 
  },
  footerText: {
    color: '#94a3b8', 
    fontSize: 12,
  }
});