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
import { MdEdit, MdWhatsapp, MdSchool } from "react-icons/md";
import { switchUserRole } from "../../../../../Utils/RoleSwitcher/RoleSwitcher";
import { StyledLoader } from "../../../../../Components/Common/StyledLoader/StyledLoader";

export default function Index() {
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const toast = useToast();
  const { user } = useAuth();
  const { role, is_send_application, is_instructor } = user?.data || {};

  useEffect(() => {
    setIsInstructor(role === "instructor" || role === "Instructor");
  }, [role]);

  // New useEffect to check is_send_application and switch to student role if needed
  useEffect(() => {
    // Check if application is false
    if (is_send_application === false || is_instructor === false) {
      switchUserRole("student", true);
    }

    // Set loading to false after a short delay to ensure role switch is complete
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Safely extract user data with default empty values
  const profile_pic = user?.data?.profile_pic || "";
  const name = user?.data?.name || "";
  const email = user?.data?.email || "";
  const sex = user?.data?.sex || "";
  const phone_number = user?.data?.phone_number || "";
  const qualification = user?.data?.qualification || "";
  const specialization = user?.data?.specialization || "";

  const handleRoleSwitch = (role) => {
    switchUserRole(role);
    toast({
      title: `Switching to ${role} role`,
      status: "info",
      duration: 2000,
    });
  };

  // Show loader while checking application status
  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="100vh"
        direction="column"
        gap={4}
      >
        <StyledLoader />
        <Heading size="md">Checking profile status...</Heading>
      </Flex>
    );
  }

  return (
    <Stack p="3" minH="100vh">
      <Stack
        pos="relative"
        w="100%"
        bgColor="purple.500"
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
          {/* {isInstructor && ( */}
          <Box display="flex" gap="3">
            <Button
              variant="outline"
              colorScheme="blue"
              borderRadius="full"
              bgColor="white"
              onClick={() => handleRoleSwitch("student")}
            >
              Switch to Student
            </Button>
            {(user?.data?.role === "admin" || user?.data?.role === "Admin") && (
              <Button
                variant="outline"
                colorScheme="purple"
                borderRadius="full"
                bgColor="white"
                onClick={() => handleRoleSwitch("admin")}
              >
                Switch to Admin
              </Button>
            )}
          </Box>
          {/* )} */}
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
            bgColor="purple.900"
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
        <Flex wrap="wrap" gap="3" direction="column" w="100%">
          <Flex wrap="wrap" gap="3">
            <Button colorScheme="blue" size="lg" variant="ghost">
              Gender: {sex}
            </Button>
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<MdWhatsapp />}
              variant="ghost"
            >
              Phone Number: {phone_number}
            </Button>
            <Button
              variant="ghost"
              colorScheme="purple"
              leftIcon={<MdSchool />}
            >
              Instructor
            </Button>
          </Flex>

          {qualification && (
            <Button colorScheme="teal" size="lg" variant="ghost">
              Qualification: {qualification}
            </Button>
          )}

          {specialization && (
            <Button colorScheme="orange" size="lg" variant="ghost">
              Specialization: {specialization}
            </Button>
          )}
        </Flex>
      </Stack>

      <Stack
        mt="5"
        p="5"
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
        bgColor="white"
        gap="4"
        alignItems="start"
      >
        <Heading size="md">Courses</Heading>
        <Divider w="100%" />
        <Flex wrap="wrap" gap="3" justifyContent="center" w="100%">
          {/* Course cards or list will go here */}
          <Button colorScheme="purple" size="lg">
            Create New Course
          </Button>
        </Flex>
      </Stack>
    </Stack>
  );
}
