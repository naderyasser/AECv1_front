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
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Instructor } from "../../../../../../../../../../../$Models/Instructor";
import { ImageUploader } from "../../../../../../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { FaUpload } from "react-icons/fa";
import { useFetch } from "../../../../../../../../../../../Hooks/Index";
import { UploadProgressModal } from "../../../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { ErrorText } from "../../../../../../../../../../../Components/Common/ErrorText/ErrorText";

const QuestionAnswerField = ({
  value,
  onChange,
  isCorrect,
  onSetCorrect,
  placeholder,
}) => {
  return (
    <Tooltip label="Select this checkbox to mark as the correct answer">
      <Flex
        borderRadius="lg"
        alignItems="center"
        p="3"
        gap="3"
        w="100%"
        bgColor={isCorrect ? "blue.100" : "gray.100"}
        transition="0.3s"
        _hover={{
          bgColor: isCorrect ? "blue.100" : "gray.200",
        }}
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
  const [formErrors, setFormErrors] = useState({});

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

  // Validate form before submission
  const validateForm = () => {
    const errors = {};

    if (!question.trim()) {
      errors.question = "Question text is required";
    }

    const emptyOptions = options.filter((opt) => !opt.value.trim());
    if (emptyOptions.length > 0) {
      errors.options = "All answer options must be filled in";
    }

    if (!correctAnswer) {
      errors.correctAnswer = "Please select a correct answer";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form has errors",
        description: "Please fix the highlighted issues",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the question data
      const questionData = {
        question: question,
        options: options,
        correctAnswer: correctAnswer,
        attachment: attachment,
        assignment: quizId,
      };

      // Use the Instructor model instead of Admin
      const { error, data: response } =
        await Instructor.Question.UpdateQuestion({
          id: questionId,
          question: questionData,
          onProgress: (percent) => {
            setUploadingPercent(percent);
          },
        });

      if (error) {
        console.error("Error from UpdateQuestion:", error);
        setUploadingPercent(0);
        throw new Error(error.message || "Failed to update question");
      }

      toast({
        status: "success",
        title: "Question updated successfully",
        description: "Your changes have been saved",
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
      <Flex direction="column" align="center" justify="center" p={8} gap={4}>
        <Text color="red.500" fontSize="lg">
          Error loading question: {questionError.message}
        </Text>
        <Button
          onClick={() => navigate(`/courses/${id}/quizes/${quizId}/questions`)}
          colorScheme="blue"
        >
          Return to Questions List
        </Button>
      </Flex>
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

      <Heading size="md">Update Quiz Question</Heading>
      <Divider />

      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <Box mb={4}>
            <Text fontWeight="medium" mb={2}>
              Question Image (Optional)
            </Text>
            <ImageUploader
              onChangeImage={(img) => setAttachment(img)}
              onRemoveImage={() => setAttachment(null)}
              img={attachment}
              label={
                <Stack p="4" alignItems="center">
                  <FaUpload />
                  <Text>Upload or Update Question Image</Text>
                </Stack>
              }
            />
          </Box>

          <Box mb={4}>
            <Text fontWeight="medium" mb={2}>
              Question Text
            </Text>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here"
              size="lg"
              minH="100px"
              isInvalid={!!formErrors.question}
            />
            {formErrors.question && (
              <ErrorText>{formErrors.question}</ErrorText>
            )}
          </Box>

          <Box mb={4}>
            <Text fontWeight="medium" mb={2}>
              Answer Options
            </Text>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Select the checkbox next to the correct answer
            </Text>

            <Flex direction="column" gap="3">
              {options.map((option, index) => (
                <QuestionAnswerField
                  key={index}
                  value={option.value}
                  onChange={(newValue) => handleOptionChange(index, newValue)}
                  isCorrect={correctAnswer === option.key}
                  onSetCorrect={() => setCorrectAnswer(option.key)}
                  placeholder={`Answer option ${index + 1}`}
                />
              ))}
            </Flex>

            {formErrors.options && <ErrorText>{formErrors.options}</ErrorText>}
            {formErrors.correctAnswer && (
              <ErrorText>{formErrors.correctAnswer}</ErrorText>
            )}
          </Box>

          <Flex gap="3" mt={4}>
            <Button
              onClick={() =>
                navigate(`/courses/${id}/quizes/${quizId}/questions`)
              }
              variant="outline"
              size="lg"
              flexGrow="1"
            >
              Cancel
            </Button>

            <Button
              isLoading={isSubmitting}
              colorScheme="green"
              type="submit"
              size="lg"
              flexGrow="1"
            >
              Save Changes
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}
