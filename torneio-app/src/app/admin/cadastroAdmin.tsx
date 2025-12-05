import React, { useState } from 'react'
import { View, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, Text } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { TextInput } from 'react-native-paper'
import { api } from '../../services/api'

const { width } = Dimensions.get('window')

export default function AdminSignUp() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [dialogoErroVisivel, setDialogoErroVisivel] = useState(false)
  const [erroDetalhes, setErroDetalhes] = useState('')
  const [dialogoSucessoVisivel, setDialogoSucessoVisivel] = useState(false)
  const [sucessoMensagem, setSucessoMensagem] = useState('')

  const handleRegister = async () => {
    try {
      if (!username || !email || !password || !secretKey) {
        mostrarErroDialog('Preencha todos os campos')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        mostrarErroDialog('Por favor, insira um email válido')
        return
      }

      if (password.length < 6) {
        mostrarErroDialog('A senha deve ter pelo menos 6 caracteres')
        return
      }

      setCarregando(true)
      
      const response = await api.post('/admin/register', {
        nome: username,
        email,
        senha: password,
        secretKey: secretKey
      })

      console.log('Cadastro bem-sucedido:', response.data)
      
      mostrarSucessoDialog(response.data.message || 'Cadastro realizado com sucesso!')

    } catch (error: any) {
      console.log('ERRO NO CADASTRO:', error)
      
      let mensagemErro = 'Erro ao realizar cadastro'
      
      if (error.response?.status === 400) {
        mensagemErro = error.response.data.error || 'Dados inválidos'
      } else if (error.response?.status === 409) {
        mensagemErro = 'Email já cadastrado'
      } else if (error.response?.status === 403) {
        mensagemErro = 'Chave de acesso inválida'
      } else if (error.response?.data?.message) {
        mensagemErro = error.response.data.message
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

  function mostrarSucessoDialog(mensagem: string) {
    setSucessoMensagem(mensagem)
    setDialogoSucessoVisivel(true)
  }

  function fecharErroDialog() {
    setDialogoErroVisivel(false)
    setErroDetalhes('')
  }

  function fecharSucessoDialog() {
    setDialogoSucessoVisivel(false)
    setSucessoMensagem('')
    
    setTimeout(() => {
      router.replace('./loginAdmin')
    }, 300)
  }

  function recarregarPagina() {
    setDialogoErroVisivel(false)
    setErroDetalhes('')
    
    setUsername('')
    setEmail('')
    setPassword('')
    setSecretKey('')
    setShowPassword(false)
    setShowSecretKey(false)
    
    setTimeout(() => {
      router.replace('./cadastroAdmin')
    }, 100)
  }

  function irParaLogin() {
    setDialogoErroVisivel(false)
    setErroDetalhes('')
    router.replace('./loginAdmin')
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.formTitle}>Cadastro (Admin)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de usuário:</Text>
            <TextInput
              mode="outlined"
              placeholder="TiaDeMel"
              placeholderTextColor="#B5B5B5"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#37A51E"
              theme={{ colors: { primary: '#37A51E' } }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seu email:</Text>
            <TextInput
              mode="outlined"
              placeholder="exemplo@email.com"
              placeholderTextColor="#B5B5B5"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#37A51E"
              theme={{ colors: { primary: '#37A51E' } }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sua senha:</Text>
            <TextInput
              mode="outlined"
              placeholder="••••••••"
              placeholderTextColor="#B5B5B5"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#37A51E"
              theme={{ colors: { primary: '#37A51E' } }}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#777"
                />
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chave de Acesso:</Text>
            <TextInput
              mode="outlined"
              placeholder="Digite a chave mestra"
              placeholderTextColor="#B5B5B5"
              secureTextEntry={!showSecretKey}
              value={secretKey}
              onChangeText={setSecretKey}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#37A51E"
              theme={{ colors: { primary: '#37A51E' } }}
              right={
                <TextInput.Icon
                  icon={showSecretKey ? "eye-off" : "eye"}
                  onPress={() => setShowSecretKey(!showSecretKey)}
                  color="#777"
                />
              }
            />
            <Text style={styles.secretKeyHint}>
              Chave especial para cadastro de administradores
            </Text>
          </View>
            
          <Button
            mode="contained"
            buttonColor="#37A51E"
            style={styles.button}
            onPress={handleRegister}
            loading={carregando}
            disabled={carregando}
            icon="account-plus"
          >
            Cadastrar
          </Button>

          <Text style={styles.footer}>
            Já tem uma conta?{' '}
            <Text style={styles.link} onPress={() => router.replace('./loginAdmin')}>
              Entrar
            </Text>
          </Text>

        </View>

        {/* Modal de Erro */}
        <Modal
          visible={dialogoErroVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={fecharErroDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="warning" size={50} color="#FF3B30" />
              </View>
              
              <Text style={styles.modalErrorTitle}>Erro no Cadastro</Text>
              
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
                  onPress={irParaLogin}
                >
                  <Ionicons name="log-in" size={20} color="#FFF" style={styles.modalButtonIcon} />
                  <Text style={styles.modalButtonLoginText}>Ir para Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Sucesso */}
        <Modal
          visible={dialogoSucessoVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={fecharSucessoDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSuccessContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#37A51E" />
              </View>
              
              <Text style={styles.modalSuccessTitle}>Cadastro Realizado!</Text>
              
              <Text style={styles.modalSuccessMessage}>
                {sucessoMensagem}
              </Text>

              <View style={styles.modalSingleButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalButtonOk}
                  onPress={fecharSucessoDialog}
                >
                  <Ionicons name="log-in" size={20} color="#FFF" style={styles.modalButtonIcon} />
                  <Text style={styles.modalButtonOkText}>Ir para Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: '100%',
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
  form: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A5A3A'
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
    color: '#333',
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#FFF',
  },
  secretKeyHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 25,
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
  // Estilos para os Modais
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
  modalSuccessContainer: {
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
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#37A51E',
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
  modalSuccessMessage: {
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
  modalSingleButtonContainer: {
    width: '100%',
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
  modalButtonOk: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#37A51E',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalButtonOkText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonIcon: {
    marginRight: 4,
  },
})