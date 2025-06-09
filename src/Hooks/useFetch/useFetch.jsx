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
      const res = await axiosInstance.get(endpoint, {
        params,
        headers:
          headers ||
          (user.data && {
            Authorization: `Bearer ${user?.data?.token?.access}`,
          }),
        ...rest,
      });
      setData(res.data);
      setError(undefined);
    } catch (err) {
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
