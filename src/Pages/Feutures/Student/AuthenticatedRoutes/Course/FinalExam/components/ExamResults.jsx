import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaCheck, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const ExamResults = ({ results, onFinish }) => {
  if (!results) return null;

  return (
    <Box
      p="2rem"
      bg="white"
      borderRadius="0.75rem"
      boxShadow="md"
      w="80%"
      h="90%"
      overflowY="auto"
      alignSelf={"center"}
    >
      <VStack spacing="6" align="stretch">
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          py="6"
        >
          <Icon as={FaCheckCircle} boxSize={12} color="green.500" mb={4} />
          <Heading size="lg" textAlign="center" mb="2">
            Final Exam Results
          </Heading>
          <Text fontSize="lg" textAlign="center">
            You scored {results.total_correct}/{results.total_questions}
          </Text>
          <Text color="gray.500" textAlign="center" mt="2">
            ({results.percentage}%)
          </Text>
        </Flex>

        <VStack spacing="4" align="stretch">
          {results.results.map((result, index) => (
            <Box
              key={result.question_id}
              p="4"
              borderWidth="1px"
              borderRadius="md"
              borderColor={result.is_correct ? "green.200" : "red.200"}
              bg={result.is_correct ? "green.50" : "red.50"}
            >
              <Text fontWeight="medium" mb="2">
                Question {index + 1}: {result.question_text}
              </Text>

              {result.user_answer ? (
                <Text fontSize="sm" color="gray.700" mb="1">
                  Your answer: {result.user_answer}
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.500" mb="1" fontStyle="italic">
                  No answer provided
                </Text>
              )}

              {!result.is_correct && (
                <Text fontSize="sm" color="gray.700">
                  Correct answer: {result.correct_answer}
                </Text>
              )}

              <Flex mt="2" alignItems="center">
                <Icon
                  as={result.is_correct ? FaCheck : FaArrowRight}
                  color={result.is_correct ? "green.500" : "red.500"}
                  mr="2"
                />
                <Text
                  fontSize="sm"
                  color={result.is_correct ? "green.600" : "red.600"}
                  fontWeight="medium"
                >
                  {result.is_correct ? "Correct" : "Incorrect"}
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>

        <Flex justify="center" mt="6">
          <Button colorScheme="blue" onClick={onFinish}>
            Return to Course
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ExamResults;
