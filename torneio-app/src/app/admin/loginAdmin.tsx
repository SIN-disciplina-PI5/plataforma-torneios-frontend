import React, { useState } from 'react'
import { View, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, Text } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { TextInput as NativeInput } from 'react-native'
import { api } from '../../services/api'

const { width } = Dimensions.get('window')

export default function AdminSignUp() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [dialogoErroVisivel, setDialogoErroVisivel] = useState(false)
  const [erroDetalhes, setErroDetalhes] = useState('')

  async function handleLogin() {
    try {
      if (!email || !password) {
        mostrarErroDialog('Preencha email e senha')
        return
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        mostrarErroDialog('Por favor, insira um email válido')
        return
      }

      setCarregando(true)
      
      const response = await api.post('/admin/login', {
        email: email,
        senha: password
      })

      console.log('Login bem-sucedido:', response.data)

      // Redirecionar para homeAdmin após login bem-sucedido
      router.replace('./homeAdmin')

    } catch (error: any) {
      console.log('Erro no login:', error.response?.data || error.message)
      
      let mensagemErro = 'Email ou senha inválidos'
      
      if (error.response?.status === 401) {
        mensagemErro = 'Credenciais inválidas'
      } else if (error.response?.status === 404) {
        mensagemErro = 'Usuário não encontrado'
      } else if (error.response?.data?.error) {
        mensagemErro = error.response.data.error
      } else if (!error.response) {
        mensagemErro = 'Erro de conexão. Verifique sua internet.'
      }
      
      mostrarErroDialog(mensagemErro)
    } finally {
      setCarregando(false)
    }
  }

  function mostrarErroDialog(erro: string) {
    setErroDetalhes(erro)
    setDialogoErroVisivel(true)
  }

  function recarregarPagina() {
    // Fechar o modal
    setDialogoErroVisivel(false)
    setErroDetalhes('')
    
    // Limpar os campos do formulário
    setEmail('')
    setPassword('')
    setShowPassword(false)
    
    // Para "recarregar" a página, vamos navegar para a mesma rota novamente
    // Isso vai resetar o estado do componente
    setTimeout(() => {
      // Usar replace para evitar histórico de navegação
      router.replace('/admin/loginAdmin')
    }, 100)
  }

  function voltarParaLogin() {
    // Fechar o modal
    setDialogoErroVisivel(false)
    setErroDetalhes('')
    
    // Navegar para a tela de login
    router.replace('/admin/loginAdmin')
  }

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require("../../../assets/images/ArenaLogo.jpg")}
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
        <Text style={styles.formTitle}>Login (Admin)</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seu email:</Text>
          <NativeInput
            style={styles.nativeInput}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="seu.email@exemplo.com"
            placeholderTextColor="#B5B5B5"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sua senha:</Text>

          <View style={styles.passwordContainer}>
            <NativeInput
              style={styles.nativeInput}
              secureTextEntry={!showPassword}
              placeholderTextColor="#B5B5B5"
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
            />

            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={22} 
                color="#777" 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => router.push('/esqueciSenha')}>
          <Text style={styles.forgotPassword}>
            Esqueci a senha
          </Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          buttonColor="#37A51E"
          style={styles.button}
          onPress={handleLogin}
          loading={carregando}
          disabled={carregando}
        >
          Entrar
        </Button>

        <Text style={styles.footer}>
          Ainda não tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/admin/cadastroAdmin')}>
            Cadastrar
          </Text>
        </Text>

      </View>

      {/* Modal de Erro - CENTRALIZADO */}
      <Modal
        visible={dialogoErroVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={recarregarPagina}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={50} color="#FF3B30" />
            </View>
            
            <Text style={styles.modalErrorTitle}>Erro no Login</Text>
            
            <Text style={styles.modalErrorMessage}>
              {erroDetalhes}
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.modalButtonRecarregar}
                onPress={recarregarPagina}
              >
                <Ionicons name="refresh" size={20} color="#FFF" style={styles.modalButtonIcon} />
                <Text style={styles.modalButtonRecarregarText}>Recarregar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButtonLogin}
                onPress={voltarParaLogin}
              >
                <Ionicons name="log-in" size={20} color="#FFF" style={styles.modalButtonIcon} />
                <Text style={styles.modalButtonLoginText}>Login Novamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    top: 15,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
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
    marginBottom: 12,
    color: '#0A5A3A'
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 15,
    color: '#333',
    fontWeight: '500'
  },
  nativeInput: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  passwordContainer: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#777'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 6,
    color: '#2E7D32',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '500'
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 6,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 14
  },
  link: {
    color: '#37A51E',
    fontWeight: 'bold'
  },
  // Estilos para o Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalErrorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalErrorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  modalButtonRecarregar: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalButtonRecarregarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonLogin: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#37A51E',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalButtonLoginText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonIcon: {
    marginRight: 4,
  },
})