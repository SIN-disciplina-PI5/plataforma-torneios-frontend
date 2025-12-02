import React, { useState } from 'react'
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { TextInput as NativeInput } from 'react-native'

const { width } = Dimensions.get('window')

export default function AdminSignUp() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require("../assets/fotoFundoSign.png")}
        style={styles.header}
        resizeMode="cover"
      >

      </ImageBackground>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Cadastro</Text>

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
          <NativeInput
            style={styles.nativeInput}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#B5B5B5"
            value={password}
            onChangeText={setPassword}
            />
        </View>

        <Button
          mode="contained"
          buttonColor="#37A51E"
          style={styles.button}
          onPress={() => {}}
        >
          Cadastrar
        </Button>

        <Text style={styles.footer}>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/loginAdmin')}>
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
    backgroundColor: '#FFFFFF'
  },

  header: {
    width: width,
    height: width * 0.55,
    justifyContent: 'center',
    alignItems: 'center'
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20
  },

  title: {
    color: '#0A5A3A',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2
  },

  subtitle: {
    color: '#000000ff',
    fontSize: 14,
    marginTop: 6
  },

  form: {
    flex: 1,
    padding: 20
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12
  },

  inputGroup: {
    marginBottom: 14
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 15,
  },

  nativeInput: {
    height: 48,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15
  },

  button: {
    marginTop: 20,
    borderRadius: 4,
    paddingVertical: 6,
  },

  footer: {
    marginTop: 20,
    textAlign: 'center'
  },

  link: {
    color: '#37A51E',
    fontWeight: 'bold'
  }
})
