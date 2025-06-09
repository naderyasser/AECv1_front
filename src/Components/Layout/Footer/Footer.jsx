import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  IconButton,
  Link as ChakraLink,
  GridItem,
  Heading,
  Divider,
  SimpleGrid,
  Stack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdFacebook,
  MdDashboard,
  MdSchool,
  MdAnalytics,
  MdPerson,
  MdSettings,
  MdMenuBook,
  MdGroup,
  MdCardMembership,
  MdChat,
  MdNotifications,
  MdAssignment,
  MdTrendingUp,
  MdBusinessCenter,
  MdPlaylistAddCheck,
  MdSearch,
  MdAdd,
  MdVideoLibrary,
} from "react-icons/md";
import {
  RiInstagramLine,
  RiYoutubeLine,
  RiTiktokLine,
  RiLinkedinLine,
  RiSnapchatLine,
  RiTwitterXLine,
} from "react-icons/ri";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../../Common/Logo/Logo";
import { useAuth } from "../../../Context/UserDataProvider/UserDataProvider";

export const Footer = () => {
  const { user } = useAuth();
  const isAuthenticated = user?.data;
  const userRole = localStorage.getItem("role")?.toLowerCase();

  const bgColor = useColorModeValue("gray.900", "gray.900");
  const textColor = useColorModeValue("white", "white");
  const headingColor = useColorModeValue("blue.300", "blue.300");
  const hoverColor = useColorModeValue("blue.300", "blue.400");
  // Platform Services
  const platformServices = [
    { name: "Training Courses & Diplomas", icon: MdChat },
    { name: "Instant Consultation Services", icon: MdChat },
    { name: "University Student Lessons", icon: MdMenuBook },
    { name: "Graduation Project Assistance", icon: MdPlaylistAddCheck },
    { name: "Scientific Research Help", icon: MdSearch },
    { name: "Exam Preparation", icon: MdAssignment },
  ];

  // Role-based navigation
  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      return {
        title: "Get Started",
        links: [
          { name: "Student Login", href: "/student/login", icon: MdPerson },
          {
            name: "Instructor Login",
            href: "/instructor/login",
            icon: MdSchool,
          },
          { name: "Admin Login", href: "/admin/login", icon: MdSettings },
          {
            name: "Become an Instructor",
            href: "/instructor/register",
            icon: MdAdd,
          },
        ],
      };
    }

    switch (userRole) {
      case "student":
        return {
          title: "Student Portal",
          links: [
            {
              name: "Dashboard",
              href: "/profile/dashboard",
              icon: MdDashboard,
            },
            {
              name: "My Courses",
              href: "/profile/my-courses",
              icon: MdVideoLibrary,
            },
            {
              name: "Assignments",
              href: "/profile/assignments",
              icon: MdAssignment,
            },
            {
              name: "Certificates",
              href: "/profile/certificates",
              icon: MdCardMembership,
            },
            {
              name: "Notifications",
              href: "/profile/notifications",
              icon: MdNotifications,
            },
            {
              name: "Reviews",
              href: "/profile/reviews",
              icon: MdChat,
            },
          ],
        };
      case "instructor":
        return {
          title: "Instructor Portal",
          links: [
            { name: "Profile", href: "/user", icon: MdPerson },
            {
              name: "My Courses",
              href: "/courses",
              icon: MdMenuBook,
            },
            {
              name: "Create Course",
              href: "/courses/create",
              icon: MdAdd,
            },
            { name: "Students", href: "/students", icon: MdGroup },
            {
              name: "Analytics",
              href: "/analytics",
              icon: MdTrendingUp,
            },
            {
              name: "Teaching Tools",
              href: "/tools",
              icon: MdSettings,
            },
          ],
        };
      case "admin":
        return {
          title: "Admin Portal",
          links: [
            {
              name: "Users Management",
              href: "/Users?Role=students",
              icon: MdGroup,
            },
            {
              name: "Instructor Apps",
              href: "/applications?status=in review",
              icon: MdBusinessCenter,
            },
            { name: "Courses", href: "/courses", icon: MdMenuBook },
            { name: "Analytics", href: "/analytics", icon: MdAnalytics },
            {
              name: "Categories",
              href: "/categories",
              icon: MdPlaylistAddCheck,
            },
            {
              name: "System Settings",
              href: "/settings",
              icon: MdSettings,
            },
          ],
        };
      default:
        return {
          title: "Quick Access",
          links: [
            { name: "About Us", href: "/about-us", icon: MdSchool },
            { name: "Courses", href: "/courses", icon: MdMenuBook },
            { name: "Contact", href: "/contact", icon: MdChat },
          ],
        };
    }
  };

  const navigationData = getNavigationLinks();
  return (
    <Box as="footer" bg={bgColor} color={textColor} pt="12" pb="8" mt="auto">
      <Box maxW="7xl" mx="auto" px={{ base: "4", md: "8" }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="8" mb="8">
          {/* Company Info */}
          <GridItem>
            <VStack align="start" spacing="4">
              <Logo color="white" />
              <Text maxW="300px" lineHeight="1.6" fontSize="sm">
                Advanced Education Academy (AEC) is your gateway to professional
                development and academic excellence. We provide comprehensive
                training programs, expert consultation, and personalized
                learning experiences.
              </Text>
              {isAuthenticated && (
                <Badge colorScheme="blue" variant="subtle">
                  Welcome, {user.data.name || userRole}!
                </Badge>
              )}
            </VStack>
          </GridItem>

          {/* Platform Services */}
          <GridItem>
            <VStack align="start" spacing="4">
              <Heading size="md" color={headingColor}>
                Our Services
              </Heading>
              <VStack align="start" spacing="2">
                {platformServices.map((service, index) => (
                  <HStack key={index} spacing="2" align="center">
                    <Box as={service.icon} size="12px" color={hoverColor} />
                    <Text
                      fontSize="sm"
                      _hover={{ color: hoverColor }}
                      cursor="default"
                    >
                      {service.name}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </GridItem>

          {/* Role-based Navigation */}
          <GridItem>
            <VStack align="start" spacing="4">
              <Heading size="md" color={headingColor}>
                {navigationData.title}
              </Heading>
              <VStack align="start" spacing="2">
                {navigationData.links.map((link, index) => (
                  <HStack key={index} spacing="2" align="center">
                    <Box as={link.icon} size="12px" color={hoverColor} />
                    <ChakraLink
                      as={RouterLink}
                      to={link.href}
                      fontSize="sm"
                      _hover={{ color: hoverColor, textDecoration: "none" }}
                      transition="color 0.2s"
                    >
                      {link.name}
                    </ChakraLink>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </GridItem>

          {/* Support & Legal */}
          <GridItem>
            <VStack align="start" spacing="4">
              <Heading size="md" color={headingColor}>
                Support & Legal
              </Heading>
              <VStack align="start" spacing="2">
                <ChakraLink
                  href="/about-us"
                  fontSize="sm"
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                >
                  About Us
                </ChakraLink>
                <ChakraLink
                  href="/contact"
                  fontSize="sm"
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                >
                  Contact Support
                </ChakraLink>
                <ChakraLink
                  href="/help"
                  fontSize="sm"
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                >
                  Help Center
                </ChakraLink>
                <ChakraLink
                  href="/privacy"
                  fontSize="sm"
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                >
                  Privacy Policy
                </ChakraLink>
                <ChakraLink
                  href="/terms"
                  fontSize="sm"
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                >
                  Terms of Service
                </ChakraLink>
              </VStack>
            </VStack>
          </GridItem>
        </SimpleGrid>

        <Divider borderColor="gray.700" my="8" />

        {/* Social Media & Copyright */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          spacing="4"
        >
          <VStack align={{ base: "center", md: "start" }} spacing="2">
            <Text fontSize="md" fontWeight="semibold" color={headingColor}>
              Follow Us
            </Text>
            <Flex gap="3" wrap="wrap" justify={{ base: "center", md: "start" }}>
              <ChakraLink
                href="https://www.facebook.com/share/16ZwzpCq6W/"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "blue.500",
                    borderColor: "blue.500",
                  }}
                  borderRadius="full"
                  aria-label="Visit our Facebook page"
                >
                  <MdFacebook />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://x.com/adv_edu_academy?t=bTRGx1WpkF0rtUWJQ5CNCw&s=09"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "gray.700",
                    borderColor: "gray.700",
                  }}
                  borderRadius="full"
                  aria-label="Visit our X (Twitter) page"
                >
                  <RiTwitterXLine />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://www.instagram.com/advanceducationacademy?igsh=dGhtb3g4a2U1MTVi"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "pink.500",
                    borderColor: "pink.500",
                  }}
                  borderRadius="full"
                  aria-label="Visit our Instagram page"
                >
                  <RiInstagramLine />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://youtube.com/@advancededucationacademy?si=Iv6cjGqtwC9t59ss"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "red.500",
                    borderColor: "red.500",
                  }}
                  borderRadius="full"
                  aria-label="Visit our YouTube channel"
                >
                  <RiYoutubeLine />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://www.tiktok.com/@advanceducationacademy?_t=ZS-8westVswPgI&_r=1"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "gray.800",
                    borderColor: "gray.800",
                  }}
                  borderRadius="full"
                  aria-label="Visit our TikTok page"
                >
                  <RiTiktokLine />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://www.linkedin.com/company/advanced-education-academy/"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "blue.600",
                    borderColor: "blue.600",
                  }}
                  borderRadius="full"
                  aria-label="Visit our LinkedIn page"
                >
                  <RiLinkedinLine />
                </IconButton>
              </ChakraLink>

              <ChakraLink
                href="https://www.snapchat.com/add/aec_education"
                isExternal
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <IconButton
                  variant="outline"
                  color="white"
                  size="sm"
                  _hover={{
                    bgColor: "yellow.400",
                    borderColor: "yellow.400",
                    color: "black",
                  }}
                  borderRadius="full"
                  aria-label="Add us on Snapchat"
                >
                  <RiSnapchatLine />
                </IconButton>
              </ChakraLink>
            </Flex>
          </VStack>

          <VStack align={{ base: "center", md: "end" }} spacing="2">
            <Text fontSize="sm" color="gray.400">
              © 2024 Advanced Education Academy
            </Text>
            <Text fontSize="xs" color="gray.500">
              All rights reserved. Building futures through education.
            </Text>
            {isAuthenticated && user.data.email && (
              <Text fontSize="xs" color="gray.400">
                Contact us at: {user.data.email}
              </Text>
            )}
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
};
