// axiosInstance.js
import { getToken } from "../Utils/GetToken/GetToken";
import axios from "axios";
import { UpdateAccessToken } from "../Utils/UpdateAccessToken/UpdateAccessToken";

// Automatically determine which base URL to use
// Use production API if deployed on Vercel or if explicitly set
const isProduction = import.meta.env.PROD || import.meta.env.VITE_USE_PRODUCTION === "true";
const apiUrl = isProduction
  ? import.meta.env.VITE_PRODUCTION_API_URL || "https://api.aectraining.com.sa/api"
  : import.meta.env.VITE_API_URL || "http://46.202.131.108:8080/api";

// Debug logging (remove in production)
console.log("Environment:", {
  PROD: import.meta.env.PROD,
  USE_PRODUCTION: import.meta.env.VITE_USE_PRODUCTION,
  isProduction,
  apiUrl
});

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json",
    // Add CORS related headers
    "Accept": "application/json",
  },
  // Enable sending cookies cross-domain
  withCredentials: false,
});

const refreshToken = async () => {
  try {
    const { refresh } = getToken();
    const resp = await instance.post("/token/refresh/", {
      refresh,
    });
    return resp.data;
  } catch (e) {
    console.log("Error", e);
  }
};

instance.interceptors.request.use(
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

instance.interceptors.response.use(
  (config) => {
    // Success case
    const token = getToken();
    if (token?.access) {
      config.headers["Authorization"] = `bearer ${token.access}`;
    }
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Improved error logging
    console.error("API Error:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle token refresh on 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest?._retry) {
      console.log("Attempting to refresh token due to 401 error");
      originalRequest._retry = true;
      try {
        const resp = await refreshToken();
        const access_token = resp.access;
        instance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        UpdateAccessToken(resp);
        console.log("Token refreshed successfully, retrying request");
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
