import axios from "axios";

export const api = axios.create({
  baseURL: "https://plataforma-torneios-backend.vercel.app/api",
  headers: {
    'Content-Type': 'application/json',
   }
});
