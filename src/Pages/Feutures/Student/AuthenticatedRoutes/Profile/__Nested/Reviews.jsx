import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Icon,
  Button,
  Badge,
  Container,
} from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";

const reviews = Array(12).fill({
  author: "Marley Botosh",
  avatar: "/path/to/avatar.jpg",
  rating: 5,
  time: "a week ago",
  content:
    "Repellendus dolor ipsum rerum possimus et rerum voluptatibus ad. Recusandae eaque quis qui repudiatidae. Vitae quae nesciunt animi omnis sit autem laboriosam. Sint consequatur minus amet delectus voluptates culpa laborum est consequatur.",
  instructor: {
    name: "Francis Quigley",
    avatar: "/path/to/instructor.jpg",
    role: "Instructor",
  },
  courseName: "Logo design crafting",
});

const ReviewCard = ({ review }) => {
  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
    >
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Avatar size="md" src={review.avatar} name={review.author} />
          <Box>
            <Text fontWeight="bold">{review.author}</Text>
            <HStack spacing={1}>
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <Icon
                    key={i}
                    as={FiStar}
                    color="yellow.400"
                    fill="yellow.400"
                    w={4}
                    h={4}
                  />
                ))}
            </HStack>
          </Box>
        </HStack>
        <HStack>
          <Text color="gray.500" fontSize="sm">
            {review.time}
          </Text>
          <Button size="sm" variant="outline" colorScheme="blue">
            Edit
          </Button>
        </HStack>
      </HStack>

      <Text color="gray.600" mb={4}>
        {review.content}
      </Text>

      <HStack spacing={3}>
        <Avatar
          size="sm"
          src={review.instructor.avatar}
          name={review.instructor.name}
        />
        <Text fontWeight="medium">{review.instructor.name}</Text>
        <Badge colorScheme="gray" fontSize="sm">
          {review.instructor.role}
        </Badge>
      </HStack>

      <Text fontSize="sm" color="gray.500" mt={2}>
        Course Name: {review.courseName}
      </Text>
    </Box>
  );
};

export default function Index() {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
        <Button
          colorScheme="blue"
          variant="ghost"
          size="lg"
          width="full"
          mt={4}
        >
          See all Reviews
        </Button>
      </VStack>
    </Container>
  );
}
