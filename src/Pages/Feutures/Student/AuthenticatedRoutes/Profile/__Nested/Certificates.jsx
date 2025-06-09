import React from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  Image,
  Flex,
  useBreakpointValue,
  Avatar,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiDownload, FiClock } from "react-icons/fi";

const resources = [
  {
    id: 1,
    title: "Learning English level 5",
    image: "/path/to/meeting-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 5,
  },
  {
    id: 2,
    title: "Learning English level 3",
    image: "/path/to/design-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 3,
  },
  {
    id: 3,
    title: "Learning English level 2",
    image: "/path/to/tech-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 2,
  },
  {
    id: 4,
    title: "Learning English level 2",
    image: "/path/to/abstract-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 2,
  },
  {
    id: 5,
    title: "Learning English level 2",
    image: "/path/to/pattern-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 2,
  },
  {
    id: 6,
    title: "Learning English level 2",
    image: "/path/to/workspace-image.jpg",
    author: "William Samy",
    authorAvatar: "/path/to/avatar.jpg",
    duration: "2h 30m",
    level: 2,
  },
];

const ResourceCard = ({ image, title, author, authorAvatar, duration }) => {
  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-4px)" }}
    >
      <Image src={image} alt={title} w="full" h="200px" objectFit="cover" />
      <Box p={4}>
        <Text fontSize="xl" fontWeight="medium" mb={4}>
          {title}
        </Text>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Avatar size="sm" name={author} src={authorAvatar} />
            <Text fontSize="sm" color="gray.600">
              {author}
            </Text>
          </HStack>
          <HStack spacing={1} color="gray.500">
            <Icon as={FiClock} />
            <Text fontSize="sm">{duration}</Text>
          </HStack>
        </Flex>
        <Button
          leftIcon={<FiDownload />}
          colorScheme="blue"
          size="lg"
          w="full"
          mt={4}
          onClick={() => console.log("Download resource")}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default function Index() {
  const columns = useBreakpointValue({
    base: 1,
    sm: 1,
    md: 2,
    lg: 3,
  });

  return (
    <Box p={8} w="100%" mx="auto" bg="gray.50">
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6} w="full">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            image={
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            }
            title={resource.title}
            author={resource.author}
            authorAvatar={resource.authorAvatar}
            duration={resource.duration}
          />
        ))}
      </Grid>
    </Box>
  );
}
