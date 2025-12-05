import axios from "axios";


export const api = axios.create({
  baseURL: "https://plataforma-torneios-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRjMjA4YmM3LWY5MjAtNDBiMS1iYTJiLTcxMTJhNDMyMjNkYyIsImVtYWlsIjoiYWRtaW45QGVtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NDg5MzI2NSwiZXhwIjoxNzY0ODk2ODY1fQ.lBf-H-24BxmIIM_52krlGW5mEVlMmRKzikxOoZh6J38`
  },
});