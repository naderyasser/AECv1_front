import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaListAlt,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

const CompletedExam = ({
  onFinish,
  onViewResults,
  onHideResults,
  loadingResults,
  showResults,
  examResults,
}) => {
  return (
    <Box
      p="2rem"
      bg="white"
      borderRadius="0.75rem"
      boxShadow="md"
      w="80%"
      textAlign="center"
      alignSelf={"center"}
    >
      <Icon as={FaCheckCircle} w={12} h={12} color="green.500" mb={4} />
      <Heading size="lg" mb="1rem">
        Final Exam Completed
      </Heading>
      <Text mb="2rem">You have already completed this final exam.</Text>

      <HStack spacing={4} justify="center">
        <Button colorScheme="blue" onClick={onFinish}>
          Return to Course
        </Button>
        {!showResults ? (
          <Button
            colorScheme="teal"
            leftIcon={<FaListAlt />}
            onClick={onViewResults}
            isLoading={loadingResults}
          >
            View Results
          </Button>
        ) : (
          <Button colorScheme="gray" onClick={onHideResults}>
            Hide Results
          </Button>
        )}
      </HStack>

      {/* Display results when showResults is true */}
      {showResults && examResults && (
        <VStack spacing="6" align="stretch" mt={8}>
          <Heading size="md" textAlign="center" mb="4">
            Your Exam Results
          </Heading>

          <Flex justify="center" align="center" direction="column" mb={4}>
            <Text fontSize="xl">
              Score: {examResults.total_correct}/{examResults.total_questions}
            </Text>
            <Text color="gray.500">({examResults.percentage}%)</Text>
          </Flex>

          <VStack spacing="4" align="stretch" maxH="400px" overflowY="auto">
            {examResults.results.map((result, index) => (
              <Box
                key={result.question_id}
                p="4"
                borderWidth="1px"
                borderRadius="md"
                borderColor={result.is_correct ? "green.200" : "red.200"}
                bg={result.is_correct ? "green.50" : "red.50"}
              >
                <Text fontWeight="medium" mb="2" textAlign="left">
                  Question {index + 1}: {result.question_text}
                </Text>

                {result.user_answer ? (
                  <Text fontSize="sm" color="gray.700" mb="1" textAlign="left">
                    Your answer: {result.user_answer}
                  </Text>
                ) : (
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mb="1"
                    fontStyle="italic"
                    textAlign="left"
                  >
                    No answer provided
                  </Text>
                )}

                {!result.is_correct && (
                  <Text fontSize="sm" color="gray.700" textAlign="left">
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
        </VStack>
      )}
    </Box>
  );
};

export default CompletedExam;
