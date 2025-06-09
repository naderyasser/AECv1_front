import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  Badge,
  Stack,
  Divider,
  useDisclosure,
  useMediaQuery,
  DrawerFooter,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import {
  FaBars,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import {
  MdAssignment,
  MdAutorenew,
  MdCategory,
  MdNotifications,
} from "react-icons/md";
import { LazyLoadedImage } from "../../../../../Components/Common/Index";
import { PiCertificateThin } from "react-icons/pi";
import { LiaStarSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";
import { switchUserRole } from "../../../../../Utils/RoleSwitcher/RoleSwitcher";
const CoverImage = () => {
  return (
    <Box
      w="100%"
      h={{ base: "200px", md: "280px" }}
      bgGradient="linear(to-r, blue.100, purple.100, pink.100)"
      position="relative"
    >
      <Button
        position="absolute"
        right={{ base: "2", md: "4" }}
        top={{ base: "2", md: "4" }}
        leftIcon={<BiPencil />}
        colorScheme="blue"
        variant="ghost"
        bg="white"
        size={{ base: "sm", md: "md" }}
        _hover={{ bg: "gray.100" }}
      >
        Edit Cover Image
      </Button>
    </Box>
  );
};

const ProfileImage = ({ name, src }) => {
  return (
    <Box position="relative">
      <Avatar
        w={{ base: "150px", md: "195px" }}
        h={{ base: "150px", md: "195px" }}
        name={name}
        src={src}
        size="2xl"
      />

      <IconButton
        icon={<BiPencil />}
        position="absolute"
        bottom="4"
        right="4"
        rounded="full"
        size="sm"
        aria-label="Edit profile picture"
      />
    </Box>
  );
};

const ProfileRating = ({ rating, totalReviews }) => {
  return (
    <HStack spacing="1">
      <HStack spacing="1">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            color={i <= rating ? "yellow.400" : "gray.300"}
            w={{ base: "12px", md: "14px" }}
            h={{ base: "12px", md: "14px" }}
          />
        ))}
      </HStack>
      <Text fontSize={{ base: "sm", md: "md" }}>{rating}</Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
        ({totalReviews})
      </Text>
    </HStack>
  );
};

const SocialLinks = () => {
  const socialIcons = [
    { icon: FaFacebook, label: "Facebook" },
    { icon: FaInstagram, label: "Instagram" },
    { icon: FaTwitter, label: "Twitter" },
    { icon: FaYoutube, label: "YouTube" },
  ];

  return (
    <HStack spacing={{ base: "1", md: "2" }}>
      {socialIcons.map(({ icon: Icon, label }) => (
        <IconButton
          key={label}
          icon={<Icon />}
          variant="ghost"
          aria-label={label}
          size={{ base: "sm", md: "md" }}
        />
      ))}
    </HStack>
  );
};

const ProfileInfo = ({ name, src, email, role, is_send_application }) => {
  const handleRoleSwitch = (role) => {
    switchUserRole(role);
  };

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      alignItems="center"
      gap={{ base: "4", md: "6" }}
      pb="6"
    >
      <ProfileImage name={name} src={src} />

      <Flex
        flex="1"
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-end" }}
        justify="space-between"
        gap={{ base: "4", md: "6" }}
        w="full"
      >
        <VStack align={{ base: "center", md: "flex-start" }} spacing="2">
          <Flex
            align="center"
            gap="2"
            direction={{ base: "column", md: "row" }}
          >
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              textAlign={{ base: "center", md: "left" }}
            >
              {name}
            </Text>
            <Button ml="2">Student</Button>
          </Flex>
          <ProfileRating rating={4.8} totalReviews={280} />
        </VStack>

        <Flex
          gap={{ base: "3", md: "4" }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "center" }}
          w={{ base: "full", md: "auto" }}
        >
          <>
            {role === "Admin" && (
              <Button
                leftIcon={<MdAutorenew />}
                colorScheme="red"
                variant="outline"
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", md: "auto" }}
                onClick={() => handleRoleSwitch("admin")}
              >
                Switch to admin
              </Button>
            )}
            {is_send_application && (
              <Button
                leftIcon={<MdAutorenew />}
                colorScheme="blue"
                variant="outline"
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", md: "auto" }}
                onClick={() => handleRoleSwitch("instructor")}
              >
                Switch to Instructor
              </Button>
            )}
          </>

          {/* <SocialLinks /> */}
        </Flex>
      </Flex>
    </Flex>
  );
};
const TabsLinks = [
  {
    title: "Dashboard ",
    Icon: MdCategory,
    href: "dashboard",
  },
  {
    title: "My Courses",
    Icon: FaVideo,
    href: "my-courses",
  },
  {
    title: "Notifications",
    Icon: MdNotifications,
    href: "notifications",
  },
  {
    title: "Assignments",
    Icon: MdAssignment,
    href: "assignments",
  },
  {
    title: "Certificate",
    Icon: PiCertificateThin,
    href: "certificates",
  },
  {
    title: "Reviews",
    Icon: LiaStarSolid,
    href: "reviews",
  },
  {
    title: "Logout",
    Icon: IoIosLogOut,
  },
];
const TabsMenu = () => {
  const { pathname } = useLocation();
  const [route] = pathname.split("/").slice(-1);

  return (
    <Stack w="100%" maxW="300px">
      {TabsLinks.map((link) => {
        const { Icon, title, href } = link;
        return (
          <>
            <Button
              as={Link}
              to={href}
              variant={route === href ? "solid" : "ghost"}
              colorScheme={route === href ? "blue" : "gray"}
              gap="3"
              justifyContent="start"
              key={title}
              size="lg"
              w="100%"
            >
              <Icon />
              {title}
            </Button>
            <Divider />
          </>
        );
      })}
    </Stack>
  );
};
export default function Index() {
  const [isPhoneQuery] = useMediaQuery("(max-width: 1200px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { name, email, src, role, is_send_application } = user.data || {};
  const loaclStorageRole = localStorage.getItem("role");
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Stack p="4" alignItems="center">
      <CoverImage />
      <Container maxW="container.xl" mt="-40px">
        <ProfileInfo
          email={email}
          src={src}
          name={name}
          role={role}
          is_send_application={is_send_application}
        />
      </Container>
      <Flex alignItems="start" gap="4" w="100%" maxW="container.xl">
        {isPhoneQuery ? (
          <Drawer size="md" isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menu</DrawerHeader>

              <DrawerBody>
                <TabsMenu />
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <TabsMenu />
        )}
        <Stack w="100%" h="100%">
          {isPhoneQuery && (
            <IconButton onClick={onOpen} mr="auto" ml="4" mb="2">
              <FaBars />
            </IconButton>
          )}

          <Outlet
            context={{
              isOpen,
              onOpen,
              onClose,
            }}
          />
        </Stack>
      </Flex>
    </Stack>
  );
}
