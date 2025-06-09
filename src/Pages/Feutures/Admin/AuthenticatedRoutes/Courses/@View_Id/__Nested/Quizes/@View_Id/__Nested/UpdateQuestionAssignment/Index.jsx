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
  Skeleton,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Admin } from "../../../../../../../../../../../$Models/Admin";
import { ImageUploader } from "../../../../../../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { FaUpload } from "react-icons/fa";
import { useFetch } from "../../../../../../../../../../../Hooks/Index";
import { UploadProgressModal } from "../../../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";

const QuestionAnswerField = ({
  value,
  onChange,
  isCorrect,
  onSetCorrect,
  placeholder,
}) => {
  return (
    <Tooltip label="Click the checkbox to set this as the correct answer">
      <Flex
        borderRadius="lg"
        alignItems="center"
        p="3"
        gap="3"
        w="100%"
        bgColor={isCorrect ? "blue.100" : "gray.100"}
        transition="0.3s"
      >
        <Checkbox
          isChecked={isCorrect}
          onChange={() => onSetCorrect()}
          colorScheme="blue"
          size="lg"
          bgColor="white"
        />
        <Input
          size="lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </Flex>
    </Tooltip>
  );
};

export default function Index() {
  const { questionId, id, quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  // State for form fields
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPercent, setUploadingPercent] = useState(0);

  // Fetch question data
  const {
    data: questionData,
    loading,
    error: questionError,
  } = useFetch({
    endpoint: `/questions/${questionId}/`,
  });

  // Initialize form with fetched data
  useEffect(() => {
    if (questionData) {
      setQuestion(questionData.question || "");

      const formattedOptions = questionData.choices.map((choice) => ({
        key: choice.id,
        value: choice.title || "",
      }));

      setOptions(formattedOptions);

      const correctChoice = questionData.choices.find(
        (choice) => choice.is_correct
      );
      setCorrectAnswer(
        correctChoice ? correctChoice.id : questionData.choices[0]?.id
      );

      if (questionData.attachments && questionData.attachments.length > 0) {
        setAttachment(questionData.attachments[0].url);
      }
    }
  }, [questionData]);

  // Handle option value change
  const handleOptionChange = (index, newValue) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], value: newValue };
    setOptions(newOptions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the question data to match what Admin.Question.UpdateQuestion expects
      const questionData = {
        question: question,
        options: options,
        correctAnswer: correctAnswer,
        attachment: attachment,
        assignment: quizId,
      };

      // Use the Admin.Question.UpdateQuestion method
      const { error, data: response } = await Admin.Question.UpdateQuestion({
        id: questionId,
        question: questionData,
        onProgress: (percent) => {
          setUploadingPercent(percent);
        },
      });

      if (error) {
        console.error("Error from UpdateQuestion:", error);
        setUploadingPercent(0); // Reset progress in case of error
        throw new Error(error.message || "Failed to update question");
      }

      toast({
        status: "success",
        title: "Question updated successfully",
      });

      navigate(`/courses/${id}/quizes/${quizId}/questions`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error updating question",
        description: error.message || "An unexpected error occurred",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questionError) {
    return (
      <Text color="red.500">
        Error loading question: {questionError.message}
      </Text>
    );
  }

  return (
    <Stack gap="4" as={Skeleton} isLoaded={!loading}>
      <UploadProgressModal
        isOpen={uploadingPercent > 0}
        uploadProgress={uploadingPercent}
        fileName={
          typeof attachment === "object" && attachment !== null
            ? attachment.name || "Question attachment"
            : "Question attachment"
        }
        fileSize={
          typeof attachment === "object" && attachment !== null
            ? attachment.size
            : 0
        }
      />
      <Heading size="md">Update Question</Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <ImageUploader
            onChangeImage={(img) => setAttachment(img)}
            onRemoveImage={() => setAttachment(null)}
            img={attachment}
            label={
              <Stack p="4" alignItems="center">
                <FaUpload />
                <Text>Upload Question Image</Text>
              </Stack>
            }
          />

          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
          />

          <Flex justifyContent="center" wrap="wrap" gap="3">
            {options.map((option, index) => (
              <QuestionAnswerField
                key={index}
                value={option.value}
                onChange={(newValue) => handleOptionChange(index, newValue)}
                isCorrect={correctAnswer === option.key}
                onSetCorrect={() => setCorrectAnswer(option.key)}
                placeholder={`Answer ${index + 1}`}
              />
            ))}
          </Flex>

          <Button isLoading={isSubmitting} colorScheme="green" type="submit">
            Update Question
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
