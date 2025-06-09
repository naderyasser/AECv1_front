import { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig/axiosInstance";
import { useAuth } from "../../Context/UserDataProvider/UserDataProvider";
export const useFetch = ({ endpoint, params = {}, headers, ...rest }) => {
  const { user } = useAuth();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const getData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching data from: ${endpoint}`, {
        baseURL: axiosInstance.defaults.baseURL,
        params,
        hasToken: user?.data?.token?.access ? 'Yes' : 'No'
      });
      
      const res = await axiosInstance.get(endpoint, {
        params,
        headers:
          headers ||
          (user.data && {
            Authorization: `Bearer ${user?.data?.token?.access}`,
          }),
        ...rest,
      });
      console.log(`Data received from ${endpoint}:`, res.data);
      setData(res.data);
      setError(undefined);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err.response || err);
      setError(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const HandleRender = () => getData();
  useEffect(() => {
    getData();
  }, [JSON.stringify(params), endpoint]);
  return {
    data,
    loading,
    error,
    HandleRender,
  };
};
