import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";
import { MdAdminPanelSettings, MdEdit, MdWhatsapp } from "react-icons/md";
import { switchUserRole } from "../../../../../Utils/RoleSwitcher/RoleSwitcher";

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const { role, is_send_application } = user.data;
  useEffect(() => {
    setIsAdmin(role === "admin" || role === "Admin");
  }, []);

  const {
    user: {
      data: { profile_pic, name, email, sex, phone_number },
    },
  } = useAuth();

  const handleRoleSwitch = (role) => {
    switchUserRole(role);
    toast({
      title: `Switching to ${role} role`,
      status: "info",
      duration: 2000,
    });
  };

  return (
    <Stack p="3" minH="100vh">
      <Stack
        pos="relative"
        w="100%"
        bgColor="blue.500"
        minH="200px"
        borderRadius="2xl"
      >
        <Flex
          wrap="wrap"
          gap="3"
          mt={"4"}
          px={"4"}
          justifyContent={"space-between"}
        >
          <Button
            variant="outline"
            bgColor="white"
            colorScheme="green"
            borderRadius="full"
          >
            Active
          </Button>
          {isAdmin && (
            <Box display="flex" gap="3">
              <Button
                variant="outline"
                bgColor="white"
                colorScheme="blue"
                borderRadius="full"
                onClick={() => handleRoleSwitch("student")}
              >
                Switch to Student
              </Button>
              {is_send_application && (
                <Button
                  variant="outline"
                  bgColor="white"
                  colorScheme="purple"
                  borderRadius="full"
                  onClick={() => handleRoleSwitch("instructor")}
                >
                  Switch to Instructor
                </Button>
              )}
            </Box>
          )}
        </Flex>

        <Flex
          px="4"
          w="100%"
          maxW="5200px"
          gap="4"
          alignItems="center"
          pos="absolute"
          bottom={{ base: "-3", md: "-10" }}
          wrap="wrap"
        >
          <Avatar
            size={{ base: "xl", md: "2xl" }}
            src={profile_pic}
            name={name}
            bgColor="blue.900"
            color="white"
            w={{ base: "110px", md: "140px" }}
            h={{ base: "110px", md: "140px" }}
          >
            <Tooltip label="edit image">
              <AvatarBadge
                right="3"
                bottom="1"
                w="fit-content"
                icon={<MdEdit />}
                as={IconButton}
                colorScheme="green"
              />
            </Tooltip>
          </Avatar>
          <Stack>
            <Heading size="md" color="white">
              {email}
            </Heading>
          </Stack>
        </Flex>
      </Stack>
      <Stack
        mt="20"
        p="5"
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
        bgColor="white"
        gap="4"
        alignItems="start"
      >
        <Heading size="md">Profile Details</Heading>
        <Divider w="100%" />
        <Flex wrap="wrap" gap="3">
          <Button colorScheme="blue" size="lg" variant="ghost">
            Gender : {sex}
          </Button>
          <Button
            size="lg"
            colorScheme="green"
            leftIcon={<MdWhatsapp />}
            variant="ghost"
          >
            Phone Number : {phone_number}
          </Button>
          <Button
            variant="ghost"
            colorScheme="orange"
            leftIcon={<MdAdminPanelSettings />}
          >
            Admin
          </Button>
        </Flex>
      </Stack>
    </Stack>
  );
}
