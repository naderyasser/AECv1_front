import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Progress,
  Icon,
  Button,
  Divider,
  useColorModeValue,
  Badge,
  Grid,
  GridItem,
  CircularProgress,
  CircularProgressLabel,
  Collapse,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StyledBtn } from "../../../../../../Components/Common/StyledBtn/StyledBtn";

// Define the AnimatedBox component using framer-motion
const AnimatedBox = motion(Box);

const ExamResults = ({ resultsData }) => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  // For the accordion functionality
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    if (resultsData) {
      setResults(resultsData);
    }
  }, [resultsData]);

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (!results) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress isIndeterminate color="blue.400" />
      </Flex>
    );
  }

  // Calculate pass/fail status (assuming 50% is passing)
  const isPassed = results.percentage >= 50;
  const percentFormatted = Math.round(results.percentage);

  return (
    <VStack spacing={8} width="100%" alignItems="stretch">
      {/* Results Summary Card */}
      <AnimatedBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        p={6}
        borderRadius="xl"
        boxShadow="md"
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <Heading as="h2" size="lg" textAlign="center">
            Exam Results
          </Heading>

          <HStack spacing={10} width="100%" justifyContent="center">
            <VStack>
              <CircularProgress
                value={percentFormatted}
                size="120px"
                thickness="8px"
                color={isPassed ? "green.400" : "red.400"}
                trackColor="gray.100"
              >
                <CircularProgressLabel fontWeight="bold" fontSize="xl">
                  {percentFormatted}%
                </CircularProgressLabel>
              </CircularProgress>
              <Badge
                colorScheme={isPassed ? "green" : "red"}
                fontSize="md"
                borderRadius="full"
                px={3}
                py={1}
              >
                {isPassed ? "PASSED" : "FAILED"}
              </Badge>
            </VStack>

            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                <Text>Correct Answers: {results.total_correct}</Text>
              </HStack>
              <HStack>
                <Icon as={CloseIcon} color="red.500" boxSize={4} />
                <Text>
                  Incorrect Answers:{" "}
                  {results.total_questions - results.total_correct}
                </Text>
              </HStack>
              <Text fontWeight="medium">
                Total Questions: {results.total_questions}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </AnimatedBox>

      {/* Questions and Answers */}
      <VStack spacing={4} alignItems="stretch">
        <Text fontSize="xl" fontWeight="bold" ml={2}>
          Question Details
        </Text>

        {results.results.map((item, index) => (
          <AnimatedBox
            key={item.question_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            borderRadius="lg"
            border="1px solid"
            borderColor={item.is_correct ? "green.200" : "red.200"}
            bg={item.is_correct ? "green.50" : "red.50"}
            _hover={{ boxShadow: "md" }}
            overflow="hidden"
          >
            <Flex
              p={4}
              justifyContent="space-between"
              alignItems="center"
              onClick={() => toggleQuestion(item.question_id)}
              cursor="pointer"
            >
              <HStack>
                <Icon
                  as={item.is_correct ? CheckCircleIcon : CloseIcon}
                  color={item.is_correct ? "green.500" : "red.500"}
                  boxSize={item.is_correct ? 5 : 4}
                  bg={item.is_correct ? "transparent" : "white"}
                  borderRadius={item.is_correct ? "none" : "full"}
                  p={item.is_correct ? 0 : 1}
                />
                <Text fontWeight="medium">Question {index + 1}</Text>
              </HStack>

              <Icon
                as={
                  expandedQuestions[item.question_id]
                    ? ChevronUpIcon
                    : ChevronDownIcon
                }
                boxSize={5}
              />
            </Flex>

            <Collapse in={expandedQuestions[item.question_id]} animateOpacity>
              <Box p={4} pt={0} bg={bgColor}>
                <Divider mb={4} />
                <Box mb={4}>
                  <Text fontWeight="semibold" mb={2} color="gray.600">
                    Question:
                  </Text>
                  <Box p={3} bg="blue.50" borderRadius="md">
                    <Text>{item.question_text}</Text>
                  </Box>
                </Box>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <GridItem>
                    <Text fontWeight="semibold" mb={2} color="gray.600">
                      Your Answer:
                    </Text>
                    <Box
                      p={3}
                      bg={item.is_correct ? "green.100" : "red.100"}
                      borderRadius="md"
                    >
                      <Text>{item.user_answer}</Text>
                    </Box>
                  </GridItem>

                  <GridItem>
                    <Text fontWeight="semibold" mb={2} color="gray.600">
                      Correct Answer:
                    </Text>
                    <Box p={3} bg="green.100" borderRadius="md">
                      <Text>{item.correct_answer}</Text>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            </Collapse>
          </AnimatedBox>
        ))}
      </VStack>

      {/* Back Button */}
      <Flex justifyContent="center" mt={6}>
        <StyledBtn
          theme="blue"
          onClick={() => navigate(-1)}
          size="md"
          width="200px"
        >
          Back to Course
        </StyledBtn>
      </Flex>
    </VStack>
  );
};

export default ExamResults;
