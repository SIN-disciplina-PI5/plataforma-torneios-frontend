import React, { useState } from 'react'
import { View, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, Text } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { TextInput as NativeInput } from 'react-native'
import { api } from '@/src/services/api'

const { width } = Dimensions.get('window')

export default function AdminSignUp() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async () => {
  try {
    const response = await api.post('/admin/register', {
      nome: username,
      email,
      senha: password,
      secretKey: secretKey
    })

    alert(response.data.message)

    router.push('/admin/loginAdmin')

  } catch (error: any) {
  console.log('ERRO COMPLETO:', error)
  console.log('DATA:', error.response?.data)
  console.log('STATUS:', error.response?.status)
  console.log('HEADERS:', error.response?.headers)
  alert(JSON.stringify(error.response?.data || error.message))
  }
}


  return (
    <View style={styles.container}>

      <ImageBackground
        source={require('@/assets/images/ArenaLogo.jpg')}
        style={styles.header}
        resizeMode="cover"
      >

        <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/')}
            >
            <Ionicons name="chevron-back" size={28} color="#0A5A3A" />
        </TouchableOpacity>

        </ImageBackground>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Cadastro (Admin)</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome de usuário:</Text>
          <NativeInput
            style={styles.nativeInput}
            placeholder="TiaDeMel"
            placeholderTextColor="#B5B5B5"
            value={username}
            onChangeText={setUsername}
            />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seu email:</Text>
          <NativeInput
            style={styles.nativeInput}
            placeholder="exemplo@email.com"
            placeholderTextColor="#B5B5B5"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Sua senha:</Text>

            <View style={styles.passwordContainer}>
                <NativeInput
                style={styles.nativeInput}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#B5B5B5"
                value={password}
                onChangeText={setPassword}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Image
                    source={showPassword
                    ? require('@/assets/images/eye-open.png')
                    : require('@/assets/images/eye-closed.png')}
                    style={styles.eyeIcon}
                />
                </TouchableOpacity>
            </View>
            </View>

            <View style={styles.inputGroup}>
          <Text style={styles.label}>Chave de Acesso:</Text>
          <NativeInput
            style={styles.nativeInput}
            placeholder="Digite a chave mestra"
            placeholderTextColor="#B5B5B5"
            secureTextEntry={true} // Oculta o texto para segurança
            value={secretKey}
            onChangeText={setSecretKey}
          />
        </View>
            
        <Button
            mode="contained"
            buttonColor="#37A51E"
            style={styles.button}
            onPress={handleRegister}
            >
            Cadastrar
        </Button>


        <Text style={styles.footer}>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/admin/loginAdmin')}>
            Entrar
          </Text>
        </Text>

      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    width: "100%",
    height: width * 0.55,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
  },

  formTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0A5A3A",
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },

  nativeInput: {
    height: 50,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: 12,
    padding: 4,
  },

  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#555",
  },

  button: {
    marginTop: 10,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },

  link: {
    color: "#37A51E",
    fontWeight: "bold",
  },
});
