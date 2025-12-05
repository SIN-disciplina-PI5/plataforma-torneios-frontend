// API.TS DEFINITIVO 
// SÓ MEXA SE PRECISAR BOTAR O TOKEN MANUALMENTE PRA TESTAR ALGO NA SUA TELA
// SE FOR MEXER, SALVE ESSE CÓDIGO E COLOQUE DE VOLTA ANTES DE COMMITAR!!!!

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
    baseURL: "https://plataforma-torneios-backend.vercel.app/api", 
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem("@token");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.log("Falha ao pegar token:", error);
    }
    return config;
});