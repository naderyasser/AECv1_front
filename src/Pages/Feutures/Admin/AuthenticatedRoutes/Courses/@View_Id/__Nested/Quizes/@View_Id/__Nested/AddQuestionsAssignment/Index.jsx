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
import { Admin } from "../../../../../../../../../../../$Models/Admin";
import { UploadProgressModal } from "../../../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";

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
    <Tooltip label="Click the checkbox to set this as the correct answer">
      <Flex
        borderRadius="lg"
        alignItems="center"
        p="3"
        gap="3"
        w="100%"
        bgColor={isChosen ? "blue.100" : "gray.100"}
        transition="0.3s"
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
    const isValid = await trigger(["questions"]);
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
    remove(currentQuestion - 1);
    if (currentQuestion !== 1) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const error = errors?.questions?.[currentQuestion - 1];

  const onSubmit = useCallback(async (data) => {
    const { error, data: Responce } = await Admin.Question.AddQuestions({
      questions: data.questions,
      id: quizId,
      onProgress: (percent) => {
        setUploadingPercent(percent);
      },
    });
    if (error) {
      toast({
        title: "Error creating quiz",
        description: error.message,
        status: "error",
      });
      setUploadingPercent(0); // Reset progress in case of error
      return;
    }
    toast({ status: "success", title: "Questions created successfully" });
    navigate(`/courses/${id}/quizes/${quizId}/questions`);
  }, []);

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
      <Heading size="md">Assignment Questions</Heading>
      <Divider />
      <React.Fragment key={currentQuestion}>
        <Controller
          name={`questions.${currentQuestion - 1}.attachment`}
          control={control}
          render={({ field }) => {
            return (
              <ImageUploader
                onChangeImage={(img) => field.onChange(img)}
                onRemoveImage={() => field.onChange()}
                img={field.value}
                label={
                  <Stack p="4" alignItems="center">
                    <FaUpload />
                    <Text>Upload Question Image</Text>
                  </Stack>
                }
              />
            );
          }}
        />
        <Textarea
          name={`questions.${currentQuestion - 1}.question`}
          isInvalid={!!error?.question}
          {...register(`questions.${currentQuestion - 1}.question`)}
          placeholder="Question"
        />
        <Flex justifyContent="center" wrap="wrap" gap="3">
          {questions[currentQuestion - 1]?.options?.map((option, index) => {
            const isChosen =
              questions[currentQuestion - 1].correctAnswer === option.key;
            const answerError = error?.options?.[index];
            return (
              <QuestionAnswerField
                key={option.key}
                placeholder={`Answer ${suffix[index]}`}
                register={register}
                name={`questions.${currentQuestion - 1}.options.${index}.value`}
                errors={answerError}
                containerStyles={{
                  flexGrow: "1",
                }}
                isChosen={isChosen}
                onChoose={() =>
                  chooseCorrectAnswer(currentQuestion - 1, option.key)
                }
              />
            );
          })}
        </Flex>
        {questions.length > 1 && (
          <Button
            onClick={onDelete}
            mr="auto"
            w="fit-content"
            colorScheme="red"
          >
            Delete Question
          </Button>
        )}
      </React.Fragment>
      <Pagination
        totalPages={questions.length}
        onPageChange={async (page) => {
          if (page > currentQuestion) {
            const isValid = await trigger([`questions.${currentQuestion - 1}`]);
            if (isValid) {
              setCurrentQuestion(page);
            }
          } else {
            setCurrentQuestion(page);
          }
        }}
        currentPage={currentQuestion}
      />
      <Button
        isDisabled={currentQuestion < questions.length}
        variant="outline"
        onClick={addMoreQuestion}
        colorScheme="blue"
      >
        Add Another Question
      </Button>
      <Button
        isLoading={isSubmitting}
        colorScheme="green"
        onClick={handleSubmit(onSubmit)}
      >
        Set Questions
      </Button>
    </Stack>
  );
}
