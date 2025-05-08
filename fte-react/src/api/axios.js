// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // If cookies or authentication are required
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
