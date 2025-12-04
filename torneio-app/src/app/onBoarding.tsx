import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    StatusBar,
    Platform,
    ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';

const rankingImage = require('../../assets/images/Group293.svg');

export default function OnBoarding() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/public/login');
    };

    const handleRegister = () => {
        router.push('/public/signup');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <View style={styles.imageContainer}>
                    <Image
                        source={rankingImage}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Suba no ranking</Text>
        
                    <Text style={styles.descriptionText}>
                        Acompanhe sua evolução, conquiste medalhas e veja sua posição entre os melhores jogadores.
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.registerButton]}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.registerButtonText}>Cadastrar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 180,
        paddingHorizontal: 30,
        paddingBottom: 30,
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    image: {
        width: '100%',
        height: '100%',
        maxWidth: 280,
    },
    descriptionContainer: {
        alignItems: 'center',
        marginBottom: 50,
        paddingHorizontal: 20,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#37A51E',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 16,
        color: '#555555',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    registerButton: {
        backgroundColor: '#F0F0F0',
        borderWidth: 2,
        borderColor: '#37A51E',
    },
    registerButtonText: {
        color: '#37A51E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#37A51E',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});