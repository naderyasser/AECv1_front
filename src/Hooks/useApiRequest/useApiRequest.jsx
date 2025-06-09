import { useState } from "react";
import axiosInstance from "../../axiosConfig/axiosInstance";
import { useAuth } from "../../Context/UserDataProvider/UserDataProvider";
export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = async ({
    url,
    method = "POST",
    body = {},
    headers = {},
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (method === "delete") {
        const response = await axiosInstance[method](url);
        setData(response.data);
        return response.data;
      } else {
        const response = await axiosInstance[method](url, body);
        setData(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, sendRequest };
};
