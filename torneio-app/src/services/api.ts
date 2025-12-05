import axios from "axios";


export const api = axios.create({
  baseURL: "https://plataforma-torneios-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWFlMTM4LThmYmEtNGJlMC1hMDhlLTYzMTNlNDMzN2E0MCIsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY0OTA5ODEwLCJleHAiOjE3NjQ5MTM0MTB9.9iYwrQMP97VPmFJ-oMotPtYpt3cDAkTbnUERg3_flFA`
  },
});