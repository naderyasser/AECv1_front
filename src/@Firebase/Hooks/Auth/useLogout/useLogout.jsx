import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../Config";
import { useToast } from "@chakra-ui/react";
export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const onLogout = async () => {
    try {
      setLoading(true);
      const req = await signOut(auth);
      setLoading(false);
      toast({
        title: "logout successfully",
        status: "success",
      });
    } catch (err) {
      const errorsMessage = err.code.message;
      setError(errorsMessage);
      setLoading(false);
      toast({
        title: "error in logout",
        description: errorsMessage,
        status: "error",
      });
    }
  };
  return { loading, error, onLogout };
};
