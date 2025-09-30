// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.logistica-utn.com", // URL de tu backend
});

export default api;