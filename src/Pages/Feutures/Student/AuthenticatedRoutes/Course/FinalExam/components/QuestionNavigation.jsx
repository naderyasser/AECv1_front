import React from "react";
import { Flex, Button, Progress, Text, Box } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

const QuestionNavigation = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  isCurrentQuestionAnswered,
  isExamComplete,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Box>
      <Flex justify="space-between" mb="2">
        <Text fontWeight="medium">
          Question {currentIndex + 1} of {totalQuestions}
        </Text>
        <Text fontWeight="medium">
          {answeredCount} of {totalQuestions} answered
        </Text>
      </Flex>
      <Progress
        value={((currentIndex + 1) / totalQuestions) * 100}
        colorScheme="blue"
        borderRadius="md"
        mb="4"
      />

      <Flex justify="space-between" mt="6">
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={onPrevious}
          isDisabled={currentIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            rightIcon={<FaArrowRight />}
            onClick={onNext}
            colorScheme="blue"
          >
            Next
          </Button>
        ) : (
          <Button
            rightIcon={<FaCheck />}
            onClick={onSubmit}
            colorScheme="green"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            isDisabled={!isExamComplete || isSubmitting}
          >
            Submit Exam
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default QuestionNavigation;
