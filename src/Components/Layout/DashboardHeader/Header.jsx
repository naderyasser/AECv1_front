import {
  Button,
  HStack,
  IconButton,
  Skeleton,
  useMediaQuery,
} from "@chakra-ui/react";
import { Logo } from "../../Common/Logo/Logo";
import { FaBars } from "react-icons/fa";
import { useNavigateHandler } from "../../../Hooks/useNavigateHandler/useNavigateHandler";
import { UserAvatar } from "../../Common/UserAvatar/UserAvatar";
import { IoReload } from "react-icons/io5";
import { useTabsMenuStatus } from "../../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { useAuth } from "../../../Context/UserDataProvider/UserDataProvider";

export const Header = () => {
  const [isPhoneQuery] = useMediaQuery("(max-width: 1000px)");
  const { onNavigate, isPending } = useNavigateHandler();
  const { user, refreshToken } = useAuth();
  const currentRole = localStorage.getItem("role");
  const { onToggle: onToggleTabsMenu } = useTabsMenuStatus();
  return (
    <>
      <HStack
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor="gray.100"
        p="3"
        pos="sticky"
        top="0"
        w="100%"
        zIndex="100"
        transition="0.3s"
        bgColor="white"
        flexWrap="wrap"
      >
        <HStack gap="7">
          <IconButton
            onClick={onToggleTabsMenu}
            borderRadius="full"
            colorScheme="blue"
          >
            <FaBars />
          </IconButton>
          <Logo redirectToMain={true} w="100px" />
        </HStack>

        <HStack as={Skeleton} fadeDuration={2} isLoaded={!user.loading} gap="3">
          {!isPhoneQuery && (
            <>
              {user.data ? (
                <>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    borderRadius="full"
                    gap="3"
                  >
                    {currentRole}
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    borderRadius="full"
                    gap="3"
                  >
                    Welcome, {user.data.first_name || user.data.name}
                  </Button>
                  <Button
                    onClick={refreshToken}
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    Refresh User Data
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => onNavigate("/login")}
                    isLoading={isPending}
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => onNavigate("/register")}
                    isLoading={isPending}
                    variant="outline"
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    Create Account
                  </Button>
                </>
              )}
            </>
          )}
          {isPhoneQuery && (
            <IconButton
              onClick={refreshToken}
              colorScheme="blue"
              borderRadius="full"
            >
              <IoReload />
            </IconButton>
          )}

          <UserAvatar
            isAuthenticated={user.data}
            profilePhoto={user.data?.profileImg}
            email={user.data?.email}
            phoneNumber={user.data?.phone}
          />
        </HStack>
      </HStack>
    </>
  );
};
