import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Icon,
  useColorModeValue,
  IconButton,
  Tooltip,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import {
  PhoneIcon,
  EmailIcon,
  TimeIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { FaUserShield } from "react-icons/fa";

export const UserBox = ({ user, onView, onEdit, onDelete }) => {
  const boxRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Load data with a small delay to simulate data loading
          // and prevent jank during scrolling
          setTimeout(() => setIsLoaded(true), 100);
          // Once visible, no need to observe anymore
          observer.unobserve(boxRef.current);
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: "100px", // Start loading when element is 100px from viewport
      }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current);
      }
    };
  }, []);

  // If not visible yet, return a placeholder with the same dimensions
  if (!isVisible) {
    return (
      <Box
        ref={boxRef}
        w="100%"
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        mb={4}
        height="90px" // Approximate height of the component
      />
    );
  }

  // If visible but not fully loaded, show skeleton
  if (!isLoaded) {
    return (
      <Box
        ref={boxRef}
        w="100%"
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        mb={4}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <SkeletonCircle size="10" mr={4} />
            <Box>
              <Skeleton height="20px" width="120px" mb={2} />
              <SkeletonText noOfLines={2} spacing="2" width="200px" />
            </Box>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }}>
            <SkeletonText noOfLines={2} spacing="2" width="150px" />
          </Flex>

          <Flex>
            <Skeleton height="32px" width="32px" mr={2} borderRadius="md" />
            <Skeleton height="32px" width="32px" mr={2} borderRadius="md" />
            <Skeleton height="32px" width="32px" borderRadius="md" />
          </Flex>
        </Flex>
      </Box>
    );
  }

  // Once data is loaded, render the actual component
  const {
    id,
    name,
    email,
    phone_number,
    role,
    is_active,
    is_instructor,
    profile_pic,
    created_at,
    last_login,
    sex,
  } = user;

  // Format dates for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Background colors based on active status
  const bgColor = useColorModeValue(
    is_active ? "white" : "gray.50",
    is_active ? "gray.800" : "gray.900"
  );

  // Border color
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Role color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "instructor":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <Box
      ref={boxRef}
      w="100%"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        {/* Left section - Avatar and basic info */}
        <Flex align="center">
          <Avatar
            size="md"
            name={name}
            src={profile_pic || undefined}
            mr={4}
            bg={profile_pic ? "transparent" : "teal.500"}
          />

          <Box>
            <Flex align="center">
              <Text fontWeight="bold" fontSize="lg">
                {name}
              </Text>
              {is_active && (
                <Badge colorScheme="green" ml={2} variant="subtle">
                  Active
                </Badge>
              )}
              <Badge colorScheme={getRoleBadgeColor(role)} ml={2}>
                {role}
              </Badge>
              {is_instructor && (
                <Badge colorScheme="purple" ml={2}>
                  Instructor
                </Badge>
              )}
            </Flex>

            <Flex mt={1} color="gray.500" fontSize="sm">
              <Flex align="center" mr={4}>
                <EmailIcon mr={1} />
                <Text>{email}</Text>
              </Flex>
              <Flex align="center">
                <PhoneIcon mr={1} />
                <Text>{phone_number}</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        {/* Middle section - Additional info */}
        <Flex
          direction="column"
          align="start"
          display={{ base: "none", md: "flex" }}
        >
          <Flex align="center" color="gray.500" fontSize="sm" mb={1}>
            <TimeIcon mr={1} />
            <Text>Last login: {formatDate(last_login)}</Text>
          </Flex>
          <Flex align="center" color="gray.500" fontSize="sm">
            <Icon as={FaUserShield} mr={1} />
            <Text>ID: {id.substring(0, 8)}...</Text>
          </Flex>
        </Flex>

        {/* Right section - Action buttons */}
        <Flex>
          <Tooltip label="View Details" placement="top">
            <IconButton
              icon={<ViewIcon />}
              colorScheme="blue"
              variant="ghost"
              mr={2}
              aria-label="View user"
              onClick={() => onView && onView(id)}
            />
          </Tooltip>

          <Tooltip label="Edit User" placement="top">
            <IconButton
              icon={<EditIcon />}
              colorScheme="green"
              variant="ghost"
              mr={2}
              aria-label="Edit user"
              onClick={() => onEdit && onEdit(id)}
            />
          </Tooltip>

          <Tooltip label="Delete User" placement="top">
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              aria-label="Delete user"
              onClick={() => onDelete && onDelete(id)}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};
