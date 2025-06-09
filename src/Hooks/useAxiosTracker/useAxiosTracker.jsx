import { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig/axiosInstance";

export function useAxiosTracker() {
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const updateLoadingState = (count) => {
      setLoading(count > 0);
    };

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        setRequestCount((prev) => {
          const newCount = prev + 1;
          updateLoadingState(newCount);
          return newCount;
        });
        return config;
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setRequestCount((prev) => {
          const newCount = prev - 1;
          updateLoadingState(newCount);
          return newCount;
        });
        return response;
      },
      (error) => {
        setRequestCount((prev) => {
          const newCount = prev - 1;
          updateLoadingState(newCount);
          return newCount;
        });
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return loading;
}
