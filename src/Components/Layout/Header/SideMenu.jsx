import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Logo } from "../../Common/Index";
import { Links } from "./Links";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const SideMenu = ({ onClose, isOpen }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Logo />
        </DrawerHeader>

        <DrawerBody>
          <Stack
            gap="5"
            pt="3"
            w="100%"
            justifyContent="center"
            alignItems="start"
          >
            {Links.map((link) => {
              return (
                <Button
                  as={Link}
                  to={link.href}
                  size="lg"
                  variant="link"
                  key={link.title}
                >
                  {link.title}
                </Button>
              );
            })}
          </Stack>
        </DrawerBody>

        <DrawerFooter gap="3">
          <Button
            as={Link}
            to="/login"
            colorScheme="blue"
            borderRadius="xl"
            variant="outline"
          >
            Login
          </Button>
          <Button as={Link} to="/register" colorScheme="blue" borderRadius="xl">
            Sign Up
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
