import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    StatusBar,
    Platform 
} from 'react-native';
import { useRouter } from 'expo-router';

const playerImage = require('../../assets/images/Group291.svg');

export default function TelaDeAbertura() {
    const router = useRouter();
    
    const handleStartCompetition = () => {
        router.push('/onBoarding');
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                <View style={styles.illustrationContainer}>
                    <Image
                        source={playerImage}
                        style={styles.playerImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.mainTitle}>
                        Bem-vindo ao Arena Lagoa Beach
                    </Text>
                    <Text style={styles.subText}>
                        Participe de torneios, acompanhe seu ranking e desafie amigos na areia
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleStartCompetition}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        Vamos competir!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    illustrationContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 0,
    },
    playerImage: {
        width: '100%',
        height: 300,
        maxWidth: 300,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 50,
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#37A51E',
        textAlign: 'center',
        marginBottom: 10,
    },
    subText: {
        fontSize: 14,
        color: '#555555',
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        width: '100%',
        backgroundColor: '#37A51E',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});