// axiosInstance.js
import { getToken } from "../Utils/GetToken/GetToken";
import axios from "axios";
import { UpdateAccessToken } from "../Utils/UpdateAccessToken/UpdateAccessToken";

// Determine which base URL to use based on the environment variable
const useProduction = import.meta.env.VITE_USE_PRODUCTION === "true";
const apiUrl = useProduction
  ? import.meta.env.VITE_PRODUCTION_API_URL
  : import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json",
  },
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
    const token = getToken();
    if (token?.access) {
      config.headers["Authorization"] = `bearer ${token.access}`;
    }
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const resp = await refreshToken();
      const access_token = resp.access;
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      UpdateAccessToken(resp);
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
