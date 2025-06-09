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
  useBreakpointValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useFetch } from "../../../../../../../../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import { Pagination } from "../../../../../../../../../../../Components/Common/Pagination/Pagination";
import { formatRelativeTime } from "../../../../../../../../../../../Utils/GetRelativeTime/GetRelativeTime";
import { LazyLoadedImage } from "../../../../../../../../../../../Components/Common/Index";
import { Admin } from "../../../../../../../../../../../$Models/Admin";

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
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/assignment-details/${quizId}/`,
  });
  const { questions: questions = [], id, created_at, updatedAt } = data || {};
  if (questions?.length === 0 && !loading) {
    return (
      <Alert size="lg" status="warning">
        <AlertIcon />
        No Questions Found
      </Alert>
    );
  }

  const handleDelete = async (id) => {
    const { error, data } = await Admin.Question.DeleteQuestion({ id });
    if (error) {
      console.error("Error deleting Question:", error);
      toast({
        title: "Error deleting Question",
        description: error.message,
        status: "error",
      });
      return;
    } else {
      HandleRender();
      toast({ status: "success", title: "Question deleted successfully" });
    }
  };

  return (
    <Stack overflow="hidden" as={Skeleton} isLoaded={!loading}>
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
          >
            Created On: {created_at && formatRelativeTime(created_at)}
          </Button>
          {updatedAt && (
            <Button size={{ base: "sm", md: "md" }}>
              Updated On: {new Date(updatedAt).toLocaleString("en-US")}
            </Button>
          )}
        </Box>
        <Flex gap="2">
          <IconButton
            colorScheme="red"
            aria-label="Delete question"
            icon={<DeleteIcon />}
            onClick={() => handleDelete(questions?.[currentQuestion - 1]?.id)}
            size={{ base: "sm", md: "md" }}
          />
          <IconButton
            colorScheme="blue"
            aria-label="Edit question"
            icon={<EditIcon />}
            as={Link}
            to={`${questions?.[currentQuestion - 1]?.id}/UpdateQuestions`}
            size={{ base: "sm", md: "md" }}
          />
        </Flex>
      </Flex>
      <Stack
        key={currentQuestion}
        className="show-opacity-animation"
        spacing={3}
      >
        {questions?.[currentQuestion - 1]?.attachments?.length >= 1 && (
          <LazyLoadedImage
            src={questions?.[currentQuestion - 1]?.attachments[0].url}
            w="100%"
            h={{ base: "200px", md: "350px" }}
            objectFit="contain"
            alt="Question Attachment"
            borderRadius="lg"
          />
        )}
        <Field
          value={questions?.[currentQuestion - 1]?.question}
          label="Question"
        />
        {questions?.[currentQuestion - 1]?.answer && (
          <Field
            value={questions?.[currentQuestion - 1]?.answer}
            label="Answer"
            bgColor="teal.50"
            borderLeft="4px solid"
            borderLeftColor="teal.400"
          />
        )}
        <Flex direction="column" gap="3">
          {questions?.[currentQuestion - 1]?.choices?.map((option, index) => {
            return (
              <Field
                key={option.key}
                value={option.title}
                label={`Answer ${ordinalSuffix[index]}`}
                w="100%"
                bgColor={option.is_correct ? "green.100" : "gray.100"}
                transition="0.3s"
              />
            );
          })}
        </Flex>
      </Stack>
      <Pagination
        onPageChange={setCurrentQuestion}
        totalPages={questions?.length}
        size={questions?.length}
        currentPage={currentQuestion}
      />
    </Stack>
  );
}
