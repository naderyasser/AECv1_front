import { getToken } from "../Utils/GetToken/GetToken";
import axios from "axios";

// Determine which base URL to use based on the environment variable
const useProduction = import.meta.env.VITE_USE_PRODUCTION === "true";
const baseUrl = useProduction
  ? import.meta.env.VITE_PRODUCTION_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL;

// Create a PayTabs specific axios instance with the base URL
const paytabsAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  },
});

// Add request interceptor to include auth token
paytabsAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token?.access) {
      config.headers["Authorization"] = `Bearer ${token?.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default paytabsAxios;
