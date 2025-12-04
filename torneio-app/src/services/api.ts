import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://plataforma-torneios-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhYWZjODJjLWU2NTUtNDE0YS1iNWIzLWFjYTJiNTc5YTNmMiIsImVtYWlsIjoiYWRtaW5iaWE1QGVtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NDg3NDI2MywiZXhwIjoxNzY0ODc3ODYzfQ.f3aD9Te9ws8DTMSOMEBkL-J-DmlQ99doSsDs-u183PY` 
  }
})


api.interceptors.request.use(config => {
  console.log('🌐 Fazendo requisição para:', config.url)
  return config
})