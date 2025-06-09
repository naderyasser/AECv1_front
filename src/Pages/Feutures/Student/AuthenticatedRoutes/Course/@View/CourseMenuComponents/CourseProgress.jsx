import React from "react";
import { Box, Progress, Flex, Text } from "@chakra-ui/react";

const CourseProgress = ({ progress }) => {
  return (
    <Box width="full">
      <Flex justifyContent="space-between" mb="0.5rem">
        <Text fontSize="0.875rem" fontWeight="500" color="black">
          Progress
        </Text>
        <Text fontSize="0.875rem" fontWeight="500" color="black">
          {progress}%
        </Text>
      </Flex>
      <Progress
        value={progress}
        height="0.4375rem"
        borderRadius="0.375rem"
        bg="rgba(2, 72, 171, 0.20)"
        colorScheme="blue"
      />
    </Box>
  );
};

export default CourseProgress;
