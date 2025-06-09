import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Skeleton,
  Stack,
  Text,
  IconButton,
  useToast,
  Box,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useFetch } from "../../../../../../../../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "../../../../../../../../../../../Components/Common/Pagination/Pagination";
import { formatRelativeTime } from "../../../../../../../../../../../Utils/GetRelativeTime/GetRelativeTime";
import { LazyLoadedImage } from "../../../../../../../../../../../Components/Common/Index";
import { Instructor } from "../../../../../../../../../../../$Models/Instructor";

const Field = ({ label, value, ...rest }) => {
  return (
    <Flex
      alignItems="flex-start"
      flexDirection={{ base: "column", sm: "row" }}
      gap="4"
      p={{ base: "2", md: "3" }}
      borderRadius="lg"
      bgColor="gray.50"
      {...rest}
    >
      <Button colorScheme="blue" size={{ base: "sm", md: "md" }}>
        {label}
      </Button>
      <Text fontSize={{ base: "md", md: "lg" }}>{value}</Text>
    </Flex>
  );
};

const ordinalSuffix = ["First", "Second", "Third", "Fourth"];

export default function Index() {
  const { quizId, id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const { data, loading, HandleRender } = useFetch({
    endpoint: `/assignment-details/${quizId}/`,
  });

  const { questions = [], created_at, updatedAt, title } = data || {};

  const handleDelete = async (questionId) => {
    try {
      const { error } = await Instructor.Question.DeleteQuestion({
        id: questionId,
      });
      if (error) {
        console.error("Error deleting question:", error);
        toast({
          title: "Error deleting question",
          description: error.message || "Something went wrong",
          status: "error",
        });
        return;
      }

      HandleRender();
      toast({
        title: "Question deleted successfully",
        status: "success",
      });

      // If we deleted the last question and it was selected, go to the previous one
      if (currentQuestion > questions.length - 1) {
        setCurrentQuestion(Math.max(1, currentQuestion - 1));
      }
    } catch (err) {
      toast({
        title: "Error deleting question",
        description: err.message || "An unexpected error occurred",
        status: "error",
      });
    }
  };

  // Empty state for no questions
  if (questions?.length === 0 && !loading) {
    return (
      <Stack spacing={4} alignItems="center" justifyContent="center" py={8}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Flex direction="column" gap={2}>
            <Text fontWeight="medium">No Questions Added Yet</Text>
            <Text fontSize="sm">Add questions to your quiz to get started</Text>
          </Flex>
        </Alert>
        <Button
          as={Link}
          to={`/courses/${id}/quizes/${quizId}/AddQuestions`}
          colorScheme="blue"
          size="lg"
          mt={4}
        >
          Add Questions
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={4} as={Skeleton} isLoaded={!loading}>
      <Flex justify="space-between" align="center" wrap="wrap">
        <Heading size="md">
          {title ? `Questions for: ${title}` : "Quiz Questions"}
        </Heading>
        <Text color="gray.600" fontSize="sm">
          {questions?.length > 0
            ? `Showing question ${currentQuestion} of ${questions.length}`
            : ""}
        </Text>
      </Flex>

      <Divider />

      <Flex
        gap="3"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box>
          <Button
            size={{ base: "sm", md: "md" }}
            mb={{ base: "2", md: "0" }}
            mr="2"
            variant="outline"
          >
            Created: {created_at && formatRelativeTime(created_at)}
          </Button>
          {updatedAt && (
            <Button size={{ base: "sm", md: "md" }} variant="outline">
              Updated: {formatRelativeTime(updatedAt)}
            </Button>
          )}
        </Box>

        {questions?.length > 0 && (
          <Flex gap="2">
            <IconButton
              colorScheme="red"
              aria-label="Delete question"
              icon={<DeleteIcon />}
              onClick={() => handleDelete(questions[currentQuestion - 1]?.id)}
              size={{ base: "sm", md: "md" }}
              title="Delete this question"
            />
            <IconButton
              colorScheme="blue"
              aria-label="Edit question"
              icon={<EditIcon />}
              as={Link}
              to={`${questions[currentQuestion - 1]?.id}/UpdateQuestions`}
              size={{ base: "sm", md: "md" }}
              title="Edit this question"
            />
          </Flex>
        )}
      </Flex>

      {questions?.length > 0 && (
        <Stack
          key={currentQuestion}
          className="show-opacity-animation"
          spacing={4}
          p={4}
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
        >
          {questions[currentQuestion - 1]?.attachments?.length >= 1 && (
            <Box borderRadius="md" overflow="hidden" bg="gray.50" p={2}>
              <LazyLoadedImage
                src={questions[currentQuestion - 1]?.attachments[0].url}
                w="100%"
                h={{ base: "200px", md: "350px" }}
                objectFit="contain"
                alt="Question Attachment"
                borderRadius="lg"
              />
            </Box>
          )}

          <Field
            value={questions[currentQuestion - 1]?.question}
            label="Question"
          />

          {questions[currentQuestion - 1]?.answer && (
            <Field
              value={questions[currentQuestion - 1]?.answer}
              label="Answer"
              bgColor="teal.50"
              borderLeft="4px solid"
              borderLeftColor="teal.400"
            />
          )}

          <Flex direction="column" gap="3">
            {questions[currentQuestion - 1]?.choices?.map((option, index) => (
              <Field
                key={option.id || index}
                value={option.title}
                label={`${ordinalSuffix[index]} Option`}
                w="100%"
                bgColor={option.is_correct ? "green.100" : "gray.100"}
                borderLeft={option.is_correct ? "4px solid" : "none"}
                borderLeftColor={option.is_correct ? "green.500" : "none"}
                transition="0.3s"
              />
            ))}
          </Flex>
        </Stack>
      )}

      {questions?.length > 1 && (
        <Box mt={4}>
          <Pagination
            onPageChange={setCurrentQuestion}
            totalPages={questions.length}
            size={questions.length}
            currentPage={currentQuestion}
          />
        </Box>
      )}

      <Flex justifyContent="center" mt={4}>
        <Button
          as={Link}
          to={`/courses/${id}/quizes/${quizId}/AddQuestions`}
          colorScheme="blue"
          leftIcon={<Text fontSize="xl">+</Text>}
        >
          Add More Questions
        </Button>
      </Flex>
    </Stack>
  );
}
