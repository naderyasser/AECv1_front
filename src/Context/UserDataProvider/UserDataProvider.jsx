import { createContext, useContext, useEffect, useState } from "react";
import { tryCatch } from "../../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../../axiosConfig/axiosInstance";
import { Progress } from "@chakra-ui/react";
const UserContext = createContext();

export const UserDataProvider = ({ children }) => {
  const GetUserData = () => {
    const UserData = localStorage.getItem("User");
    if (UserData) {
      try {
        return JSON.parse(UserData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState({
    loading: false,
    data: GetUserData(),
    error: undefined,
  });

  useEffect(() => {
    if (user.data) {
      localStorage.setItem("User", JSON.stringify(user.data));
    } else {
      localStorage.removeItem("User");
    }
  }, [user.data]);

  const onAuth = async (data, type = "Student") => {
    try {
      setUser({
        loading: true,
        data: undefined,
        error: undefined,
      });
      const { data: ResponceData, error } = await tryCatch(async () => {
        return await axiosInstance.post("/token/", {
          email: data.email,
          password: data.password,
        });
      });

      if (error) {
        setUser({
          loading: false,
          data: undefined,
          error: true,
        });
      } else {
        setUser({
          loading: false,
          data: { ...data, token: ResponceData.data, role: type },
          error: undefined,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const refreshToken = async () => {
    try {
      if (!user.data?.token?.refresh) {
        throw new Error("No refresh token available");
      }
      setUser({
        loading: true,
        data: user.data,
        error: true,
      });
      const { data: ResponceData, error } = await tryCatch(async () => {
        return await axiosInstance.post("/token/refresh/", {
          refresh: user.data.token.refresh,
        });
      });

      if (error) {
        setUser({
          loading: false,
          data: undefined,
          error: true,
        });
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          loading: false,
          data: {
            ...prevUser.data,
            token: {
              ...prevUser.data.token,
              access: ResponceData.data.access,
            },
          },
        }));
      }
    } catch (err) {
      console.log(err);
      setUser({
        loading: false,
        data: undefined,
        error: true,
      });
    }
  };

  const onLogout = () => {
    setUser({
      data: undefined,
      loading: false,
      error: false,
    });
    localStorage.removeItem("User");
  };

  return (
    <UserContext.Provider
      value={{
        onAuth,
        refreshToken,
        user,
        onLogout,
      }}
    >
      {user.loading && (
        <Progress
          pos="fixed"
          top="0"
          zIndex="1000000"
          w="100%"
          size="xs"
          isIndeterminate
        />
      )}
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
export const getUserData = () => {
  const User = localStorage.getItem("User");
  if (User) {
    return JSON.parse(User);
  }
};
