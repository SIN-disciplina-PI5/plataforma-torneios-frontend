import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://plataforma-torneios-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlNTg4NTg1LTUxNWMtNDY1ZC1hOGJiLWVlODIwZjFhZTQ4NSIsImVtYWlsIjoiYWRtaW41QHRlc3RlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NDc5MjUwMywiZXhwIjoxNzY0Nzk2MTAzfQ.CvDqS5eGqKYByEEKU8MTWSe15Ix7pIT94pDoKo3oB_I"
  }
});