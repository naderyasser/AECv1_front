import React from "react";
import {
  Box,
  Grid,
  Text,
  Button,
  Progress,
  VStack,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";
import { LazyLoadedImage } from "../../../../../../Components/Common/Index";

const assignments = [
  {
    id: 1,
    image: "/path/to/silhouette.jpg",
    score: 8,
    total: 10,
  },
  {
    id: 2,
    image: "/path/to/plant.jpg",
    score: 5,
    total: 10,
  },
  {
    id: 3,
    image: "/path/to/sunset.jpg",
    score: 10,
    total: 10,
  },
  {
    id: 4,
    image: "/path/to/cactus.jpg",
    score: 10,
    total: 10,
  },
  {
    id: 5,
    image: "/path/to/blue-smoke.jpg",
    score: 9,
    total: 10,
  },
  {
    id: 6,
    image: "/path/to/desert.jpg",
    score: 4,
    total: 10,
  },
];

const AssignmentCard = ({ image, score, total }) => {
  const progress = (score / total) * 100;

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-4px)" }}
    >
      <LazyLoadedImage
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        ImageProps={{
          objectFit: "cover",
        }}
        alt="Assignment"
        w="full"
        h="200px"
        objectFit="cover"
      />
      <VStack p={4} spacing={3} align="stretch">
        <Text fontSize="lg" fontWeight="medium">
          Learning English level 2 - Assignment
        </Text>
        <Box display="flex" alignItems="center" gap={2}>
          <FaGraduationCap />
          <Text>
            {score}/{total}
          </Text>
        </Box>
        <Progress
          value={progress}
          size="sm"
          colorScheme="blue"
          borderRadius="full"
        />
        <Button
          colorScheme="blue"
          size="md"
          w="full"
          onClick={() => console.log("View assignment")}
        >
          View Assignment
        </Button>
      </VStack>
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
    <Box p={8} maxW="1200px" mx="auto">
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6} w="full">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            image={assignment.image}
            score={assignment.score}
            total={assignment.total}
          />
        ))}
      </Grid>
    </Box>
  );
}
