import { Button, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuth } from "../../../Context/UserDataProvider/UserDataProvider";
export const LogoutButton = ({ ...rest }) => {
  const { onLogout } = useAuth();
  return (
    <Button onClick={onLogout} colorScheme="red" {...rest}>
      logout
    </Button>
  );
};
