import React from "react";
import { Box, Flex, Text, Icon, Button } from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";

const FinalExam = ({ hasFinalExam, onClick }) => {
  if (!hasFinalExam) return null;

  return (
    <Box width="full" mt="1rem">
      <Flex
        direction="column"
        borderWidth="1px"
        borderColor="blue.100"
        borderRadius="0.75rem"
        p="1.5rem"
        bg="blue.50"
        alignItems="center"
      >
        <Icon as={FaGraduationCap} boxSize={8} color="blue.500" mb="1rem" />

        <Text
          fontSize="1.125rem"
          fontWeight="600"
          mb="0.5rem"
          textAlign="center"
        >
          Final Exam
        </Text>

        <Text
          fontSize="0.875rem"
          color="gray.600"
          mb="1.5rem"
          textAlign="center"
        >
          Complete all sections before taking the final exam
        </Text>

        <Button
          onClick={onClick}
          colorScheme="blue"
          size="md"
          width="full"
          borderRadius="0.5rem"
        >
          Start Final Exam
        </Button>
      </Flex>
    </Box>
  );
};

export default FinalExam;
