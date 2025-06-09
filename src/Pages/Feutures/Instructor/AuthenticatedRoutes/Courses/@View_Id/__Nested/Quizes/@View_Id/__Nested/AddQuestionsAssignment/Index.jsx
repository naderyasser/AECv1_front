import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Stack,
  Textarea,
  Tooltip,
  useToast,
  Text,
  Input,
  Box,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Pagination } from "../../../../../../../../../../../Components/Common/Pagination/Pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import { ImageUploader } from "../../../../../../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { FaUpload } from "react-icons/fa";
import { Instructor } from "../../../../../../../../../../../$Models/Instructor";
import { UploadProgressModal } from "../../../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { ErrorText } from "../../../../../../../../../../../Components/Common/ErrorText/ErrorText";

const QuestionAnswerField = ({
  name,
  errors,
  register,
  containerStyles,
  onChoose,
  isChosen,
  placeholder,
  ...params
}) => {
  return (
    <Tooltip label="Select this checkbox to mark as the correct answer">
      <Flex
        borderRadius="lg"
        alignItems="center"
        p="3"
        gap="3"
        w="100%"
        bgColor={isChosen ? "blue.100" : "gray.100"}
        transition="0.3s"
        _hover={{
          bgColor: isChosen ? "blue.100" : "gray.200",
        }}
        {...containerStyles}
      >
        <Checkbox
          isChecked={isChosen}
          onChange={() => onChoose()}
          colorScheme="blue"
          size="lg"
          bgColor="white"
        />
        <Input
          size="lg"
          placeholder={placeholder}
          {...register(name)}
          isInvalid={!!errors}
        />
      </Flex>
    </Tooltip>
  );
};

const suffix = ["First", "Second", "Third", "Fourth"];

export default function Index() {
  const { quizId, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [uploadingPercent, setUploadingPercent] = useState(0);

  const {
    register,
    control,
    setValue,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: async () => ({
      questions: [
        {
          question: "",
          options: [
            { key: "a", value: "" },
            { key: "b", value: "" },
            { key: "c", value: "" },
            { key: "d", value: "" },
          ],
          correctAnswer: "a",
        },
      ],
    }),
    resolver: zodResolver(schema),
  });

  const {
    fields: questions,
    append,
    replace,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const addMoreQuestion = async () => {
    // Validate current question before allowing to add a new one
    const isValid = await trigger([`questions.${currentQuestion - 1}`]);
    if (isValid) {
      append({
        question: "",
        options: [
          { key: "a", value: "" },
          { key: "b", value: "" },
          { key: "c", value: "" },
          { key: "d", value: "" },
        ],
        correctAnswer: "a",
      });
      setCurrentQuestion((prev) => prev + 1);
    } else {
      toast({
        title: "Please complete the current question",
        description: "Fill in all required fields before adding a new question",
        status: "warning",
        duration: 3000,
      });
    }
  };

  const chooseCorrectAnswer = (index, chosenAnswer) => {
    const { questions } = getValues();
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      correctAnswer: chosenAnswer,
    };
    replace(newQuestions);
  };

  const onDelete = () => {
    if (questions.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You need at least one question for the quiz",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    remove(currentQuestion - 1);
    if (currentQuestion !== 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const error = errors?.questions?.[currentQuestion - 1];

  const onSubmit = useCallback(
    async (data) => {
      const { error, data: response } = await Instructor.Question.AddQuestions({
        questions: data.questions,
        id: quizId,
        onProgress: (percent) => {
          setUploadingPercent(percent);
        },
      });

      if (error) {
        toast({
          title: "Error Creating Questions",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 5000,
        });
        setUploadingPercent(0); // Reset progress in case of error
        return;
      }

      toast({
        status: "success",
        title: "Questions Created Successfully",
        description: `Added ${data.questions.length} question(s) to your quiz`,
      });

      navigate(`/courses/${id}/quizes/${quizId}/questions`);
    },
    [quizId, id, navigate, toast]
  );

  return (
    <Stack gap="4">
      <UploadProgressModal
        isOpen={uploadingPercent > 0}
        uploadProgress={uploadingPercent}
        fileName={
          getValues()?.questions?.[currentQuestion - 1]?.attachment?.name ||
          "Question attachment"
        }
        fileSize={
          getValues()?.questions?.[currentQuestion - 1]?.attachment?.size
        }
      />

      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="md">Create Quiz Questions</Heading>
        <Text color="gray.600" fontSize="sm">
          Question {currentQuestion} of {questions.length}
        </Text>
      </Flex>

      <Divider />

      <React.Fragment key={currentQuestion}>
        <Box mb={4}>
          <Text fontWeight="medium" mb={2}>
            Question Text
          </Text>
          <Textarea
            name={`questions.${currentQuestion - 1}.question`}
            isInvalid={!!error?.question}
            {...register(`questions.${currentQuestion - 1}.question`)}
            placeholder="Enter your question here"
            size="lg"
            minH="100px"
          />
          {error?.question && <ErrorText>{error.question.message}</ErrorText>}
        </Box>

        <Box mb={4}>
          <Text fontWeight="medium" mb={2}>
            Question Image (Optional)
          </Text>
          <Controller
            name={`questions.${currentQuestion - 1}.attachment`}
            control={control}
            render={({ field }) => (
              <ImageUploader
                onChangeImage={(img) => field.onChange(img)}
                onRemoveImage={() => field.onChange()}
                img={field.value}
                label={
                  <Stack p="4" alignItems="center">
                    <FaUpload />
                    <Text>Upload an image for this question</Text>
                  </Stack>
                }
              />
            )}
          />
        </Box>

        <Box mb={4}>
          <Text fontWeight="medium" mb={2}>
            Answer Options
          </Text>
          <Text fontSize="sm" color="gray.600" mb={3}>
            Select the checkbox next to the correct answer
          </Text>

          <Flex direction="column" gap="3">
            {questions[currentQuestion - 1]?.options?.map((option, index) => {
              const isChosen =
                questions[currentQuestion - 1].correctAnswer === option.key;
              const answerError = error?.options?.[index];

              return (
                <QuestionAnswerField
                  key={option.key}
                  placeholder={`${suffix[index]} option`}
                  register={register}
                  name={`questions.${
                    currentQuestion - 1
                  }.options.${index}.value`}
                  errors={answerError}
                  isChosen={isChosen}
                  onChoose={() =>
                    chooseCorrectAnswer(currentQuestion - 1, option.key)
                  }
                />
              );
            })}
          </Flex>

          {error?.options && <ErrorText>{error.options.message}</ErrorText>}
          {error?.correctAnswer && (
            <ErrorText>{error.correctAnswer.message}</ErrorText>
          )}
        </Box>

        <Flex justify="space-between" mt={4} mb={6}>
          <Button
            onClick={onDelete}
            colorScheme="red"
            variant="outline"
            leftIcon={<Text fontSize="xl">−</Text>}
          >
            Delete Question
          </Button>

          <Button
            onClick={addMoreQuestion}
            colorScheme="blue"
            variant="outline"
            leftIcon={<Text fontSize="xl">+</Text>}
          >
            Add Another Question
          </Button>
        </Flex>
      </React.Fragment>

      {questions.length > 1 && (
        <Box mb={4}>
          <Text fontWeight="medium" mb={2}>
            Question Navigation
          </Text>
          <Pagination
            totalPages={questions.length}
            onPageChange={async (page) => {
              if (page > currentQuestion) {
                const isValid = await trigger([
                  `questions.${currentQuestion - 1}`,
                ]);
                if (isValid) {
                  setCurrentQuestion(page);
                } else {
                  toast({
                    title: "Please complete the current question",
                    status: "warning",
                    duration: 2000,
                  });
                }
              } else {
                setCurrentQuestion(page);
              }
            }}
            currentPage={currentQuestion}
          />
        </Box>
      )}

      <Flex gap="3" mt="6">
        <Button
          onClick={() => navigate(`/courses/${id}/quizes/${quizId}`)}
          variant="outline"
          size="lg"
          flexGrow="1"
        >
          Cancel
        </Button>

        <Button
          isLoading={isSubmitting}
          colorScheme="green"
          onClick={handleSubmit(onSubmit)}
          size="lg"
          flexGrow="1"
        >
          Save Questions
        </Button>
      </Flex>
    </Stack>
  );
}
