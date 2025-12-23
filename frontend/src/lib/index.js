import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const BASE_URL = "http://localhost:3001/"

export const clientServer = axios.create({
    baseURL: BASE_URL
})

clientServer.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

clientServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);