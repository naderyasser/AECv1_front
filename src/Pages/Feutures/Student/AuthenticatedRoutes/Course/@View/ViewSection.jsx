import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Center,
  Text,
  VStack,
  Button,
  Alert,
  AlertIcon,
  Link,
  Heading,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  HStack,
  Progress,
  useToast,
  Spinner,
  Icon,
  Image,
} from "@chakra-ui/react";
import {
  FaPlay,
  FaFileDownload,
  FaClock,
  FaHourglassHalf,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaListAlt,
} from "react-icons/fa";
import { StyledBtn } from "../../../../../../Components/Common/StyledBtn/StyledBtn";
import { GrDocumentText } from "react-icons/gr";
import ReactPlayer from "react-player";
import axiosInstance from "../../../../../../axiosConfig/axiosInstance";
import { CheckIcon } from "@chakra-ui/icons";

const ViewSection = ({
  content,
  onNext,
  onBack,
  hasNext,
  hasBack,
  width = "100%",
  onLessonComplete,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examData, setExamData] = useState(null);
  console.log("🚀 ~ examData:", examData);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [assignmentComplete, setAssignmentComplete] = useState(false);
  const [assignmentResults, setAssignmentResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [lessonStartTime, setLessonStartTime] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonDuration, setLessonDuration] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("User"));
  useEffect(() => {
    if (content && content.type === "assignment" && content.timer) {
      setTimer(content.timer * 60);
    }

    if (content?.id !== examData?.id) {
      setExamStarted(false);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setExamData(null);
    }
  }, [content, examData?.id]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      toast({
        title: "Time's up!",
        description: "Your assignment will be submitted automatically.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      handleSubmitExam();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, isTimerActive]);

  useEffect(() => {
    if (content && content.type === "assignment") {
      setAssignmentComplete(content.is_done || false);
      setAssignmentResults(null);

      if (
        content.is_done &&
        !examResults &&
        !showResults &&
        !assignmentResults
      ) {
        fetchAssignmentResults(content.id);
      }
    }
  }, [content]);

  useEffect(() => {
    if (content && content.type === "lesson" && content.video_url) {
      setIsPlaying(false);
      setLessonProgress(0);

      if (!content.is_done) {
        setLessonStartTime(new Date().toISOString());
      }
    }
  }, [content]);

  const fetchAssignmentQuestions = async (assignmentId) => {
    try {
      setLoadingQuestions(true);
      const response = await axiosInstance.get(
        `/assignment-details/${assignmentId}/`,
        {
          headers: user.data && {
            Authorization: `Bearer ${user?.data?.token?.access}`,
          },
        }
      );
      setExamData(response.data);
      setQuestionError(null);
    } catch (error) {
      console.error("Error fetching assignment questions:", error);
      setQuestionError(
        error.response?.data?.message ||
          "Could not load assignment questions. Please try again."
      );
      toast({
        title: "Error",
        description: "Failed to load assignment questions.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchAssignmentResults = async (assignmentId) => {
    try {
      setLoadingResults(true);
      const response = await axiosInstance.get(
        `/assignments/${assignmentId}/results/`,
        {
          headers: user.data && {
            Authorization: `Bearer ${user?.data?.token?.access}`,
          },
        }
      );
      setAssignmentResults(response.data);
    } catch (error) {
      console.error("Error fetching assignment results:", error);
      toast({
        title: "Error",
        description: "Failed to load assignment results.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingResults(false);
    }
  };

  const markLessonAsComplete = async () => {
    if (content && content.type === "lesson" && !content.is_done) {
      try {
        const payload = {
          start_at: lessonStartTime || new Date().toISOString(),
          lesson: content.id,
          user: user.id,
          finished_at: new Date().toISOString(),
          is_done: true,
        };

        await axiosInstance.post("/lesson-progress/", payload);

        // Update the content object locally to reflect the change
        const updatedContent = { ...content, is_done: true };

        // Call the callback to update the parent component state
        if (onLessonComplete) {
          onLessonComplete(updatedContent);
        }

        // toast({
        //   title: "Lesson completed",
        //   description: "Your progress has been saved",
        //   status: "success",
        //   duration: 3000,
        //   isClosable: true,
        // });
      } catch (error) {
        console.error("Error updating lesson progress:", error);
      }
    }
  };

  const handleVideoProgress = (progress) => {
    const played = progress.played;
    setLessonProgress(played);

    if (played > 0.9 && !content.is_done) {
      markLessonAsComplete();
    }
  };

  const handleVideoDuration = (duration) => {
    setLessonDuration(duration);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().playVideo();
    }
  };

  const handleStartAssignment = async () => {
    if (!content || !content.id) {
      toast({
        title: "Error",
        description: "Invalid assignment data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setExamStarted(true);
    setIsTimerActive(true);

    await fetchAssignmentQuestions(content.id);
    onClose();
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const nextQuestion = () => {
    if (examData && currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const formatAnswersForSubmission = () => {
    const formattedAnswers = [];

    // Process all questions, including unanswered ones
    if (examData && examData.questions) {
      examData.questions.forEach((question) => {
        const choiceId = selectedAnswers[question.id];

        if (choiceId) {
          // Question was answered
          const choice = question.choices.find((c) => c.id === choiceId);
          if (choice) {
            formattedAnswers.push({
              question_id: question.id,
              answer: choice.title,
            });
          }
        } else {
          // Question was not answered
          formattedAnswers.push({
            question_id: question.id,
            answer: null,
          });
        }
      });
    }

    return { answers: formattedAnswers };
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = formatAnswersForSubmission();

      const response = await axiosInstance.post("/correct-answers/", payload);

      setExamResults(response.data);

      try {
        await axiosInstance.post("/assignments/mark-as-done/", {
          assignment: content.id,
        });
        console.log("Assignment marked as done successfully");

        // Update the local state to reflect the assignment completion
        setAssignmentComplete(true);

        // Update the content object locally to reflect the change
        const updatedContent = { ...content, is_done: true };

        // Call the callback to update the parent component state
        if (onLessonComplete) {
          onLessonComplete(updatedContent);
        }
      } catch (markError) {
        console.error("Error marking assignment as done:", markError);
      }

      setShowResults(true);

      toast({
        title: "Assignment submitted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error submitting assignment",
        description: error.response?.data?.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setIsTimerActive(false);
    }
  };

  const isCurrentQuestionAnswered = () => {
    if (!examData) return false;
    const currentQuestion = examData.questions[currentQuestionIndex];
    return !!selectedAnswers[currentQuestion.id];
  };

  const getAnsweredQuestionsCount = () => {
    if (!examData) return 0;
    return Object.keys(selectedAnswers).length;
  };

  const isExamComplete = () => {
    if (!examData) return false;

    const requiredQuestions = examData.questions.filter((q) => q.is_required);
    return requiredQuestions.every((q) => !!selectedAnswers[q.id]);
  };

  const handleNextLesson = () => {
    setShowResults(false);
    setExamStarted(false);
    onNext();
  };

  const showAssignmentResults = () => {
    if (examResults) {
      setShowResults(true);
    } else if (assignmentResults) {
      setExamResults(assignmentResults);
      setShowResults(true);
    } else {
      fetchAssignmentResults(content.id);
    }
  };

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <VStack mt={4} spacing={3} align="stretch">
        <Text fontWeight="medium">Attachments:</Text>
        <Box borderWidth="1px" borderRadius="md" p={2}>
          {attachments.map((attachment, index) => (
            <Box key={index} mb={index < attachments.length - 1 ? 3 : 0}>
              {attachment.type === "image" ? (
                <VStack align="center">
                  <Image
                    src={attachment.url}
                    alt={attachment.title}
                    maxH="300px"
                    borderRadius="md"
                  />
                </VStack>
              ) : (
                <Flex
                  alignItems="center"
                  gap="3"
                  p="3"
                  borderRadius="md"
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                >
                  {getFileIcon(attachment.type)}
                  <Text flex="1" fontSize="1rem">
                    {attachment.title || "Attachment"}
                  </Text>
                  <Button
                    as="a"
                    href={attachment.url}
                    target="_blank"
                    download
                    px="4"
                    py="2"
                    fontSize="0.875rem"
                    fontWeight="medium"
                    color="#0248AB"
                    borderRadius="0.75rem"
                    bg="rgba(2, 72, 171, 0.10)"
                    _hover={{ bg: "rgba(2, 72, 171, 0.15)" }}
                    rightIcon={<FaFileDownload />}
                  >
                    Download
                  </Button>
                </Flex>
              )}
            </Box>
          ))}
        </Box>
      </VStack>
    );
  };

  if (!content) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        w={width}
        h="33.5rem"
      >
        <Text fontSize="1.25rem" color="#838383">
          Select a lesson to start
        </Text>
      </Flex>
    );
  }

  const contentType = content.type || "lesson";

  const getFilenameFromUrl = (url, title) => {
    if (title) return title;

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.substring(pathname.lastIndexOf("/") + 1);
    } catch (e) {
      return "file";
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "document":
      case "pdf":
        return <GrDocumentText size="1.2rem" />;
      default:
        return <FaFileDownload size="1.2rem" />;
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      gap="2.5rem"
      w={width}
      alignSelf="stretch"
      flex="1 0 0"
    >
      {contentType === "lesson" && (
        <Box
          w="100%"
          h="33.5rem"
          position="relative"
          overflow="hidden"
          borderRadius="1rem"
          bg="black"
        >
          {content.video_url ? (
            <ReactPlayer
              ref={playerRef}
              url={content.video_url}
              width="100%"
              height="100%"
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                markLessonAsComplete();
              }}
              onProgress={handleVideoProgress}
              onDuration={handleVideoDuration}
              controls={isPlaying}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 },
                },
              }}
            />
          ) : (
            <Flex
              w="100%"
              h="100%"
              justifyContent="center"
              alignItems="center"
              bg="gray.100"
            >
              <Text fontSize="1.25rem" color="#838383">
                No video content available for this lesson
              </Text>
            </Flex>
          )}
          {content.video_url && !isPlaying && (
            <Center
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              borderRadius="full"
              w="5rem"
              h="5rem"
              bg="white"
              cursor="pointer"
              onClick={handlePlayClick}
              zIndex="10"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
            >
              <FaPlay color="#0248AB" size="1.875rem" />
            </Center>
          )}
          {content.is_done && (
            <Box
              position="absolute"
              top="1rem"
              right="1rem"
              bg="green.500"
              color="white"
              borderRadius="md"
              px="3"
              py="1"
              display="flex"
              alignItems="center"
              gap="2"
              zIndex="10"
              boxShadow="md"
            >
              <Icon as={FaCheckCircle} />
              <Text fontWeight="medium">Completed</Text>
            </Box>
          )}
        </Box>
      )}

      {contentType === "assignment" && (
        <Flex
          w="100%"
          h="33.5rem"
          direction="column"
          justifyContent="center"
          alignItems="center"
          bg="gray.100"
          borderRadius="1rem"
          position="relative"
        >
          {assignmentComplete && !examStarted && !showResults && (
            <Box
              p="2rem"
              bg="white"
              borderRadius="0.75rem"
              boxShadow="md"
              w="80%"
              textAlign="center"
            >
              <Icon as={FaCheckCircle} w={12} h={12} color="green.500" mb={4} />
              <Heading size="lg" mb="1rem">
                Assignment Completed
              </Heading>
              <Text mb="2rem">You have already completed this assignment.</Text>

              {loadingResults ? (
                <Spinner size="md" color="blue.500" />
              ) : (
                <Flex justify="center" gap="4">
                  <Button
                    colorScheme="blue"
                    leftIcon={<FaListAlt />}
                    onClick={showAssignmentResults}
                  >
                    View Results
                  </Button>
                  {hasNext && (
                    <Button colorScheme="green" onClick={onNext}>
                      Next Lesson
                    </Button>
                  )}
                </Flex>
              )}
            </Box>
          )}

          {!assignmentComplete && !examStarted && !showResults && (
            <Box
              p="2rem"
              bg="white"
              borderRadius="0.75rem"
              boxShadow="md"
              w="80%"
            >
              <Heading size="lg" mb="1rem">
                Assignment: {content.title}
              </Heading>
              <Text mb="2rem">
                {content.description ||
                  "Complete this assignment to progress in the course."}
              </Text>

              <Flex direction="column" align="center" gap="1rem">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  This assignment has a time limit of {content.timer} minutes
                </Alert>

                <Button
                  mt="2rem"
                  colorScheme="blue"
                  leftIcon={<FaHourglassHalf />}
                  onClick={onOpen}
                >
                  Start Assignment
                </Button>
              </Flex>
            </Box>
          )}

          {showResults && examResults && (
            <Box
              p="2rem"
              bg="white"
              borderRadius="0.75rem"
              boxShadow="md"
              w="80%"
              h="90%"
              overflowY="auto"
            >
              <VStack spacing="6" align="stretch">
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  py="6"
                >
                  <Icon as={CheckIcon} boxSize={12} color="green.500" mb={4} />
                  <Heading size="lg" textAlign="center" mb="2">
                    Assignment Results
                  </Heading>
                  <Text fontSize="lg" textAlign="center">
                    You scored {examResults.total_correct}/
                    {examResults.total_questions}
                  </Text>
                  <Text color="gray.500" textAlign="center" mt="2">
                    ({examResults.percentage}%)
                  </Text>
                </Flex>

                <Divider />

                <Heading size="md" mb="4">
                  Results Summary
                </Heading>

                <VStack spacing="4" align="stretch">
                  {examResults.results.map((result, index) => {
                    const question = examData?.questions.find(
                      (q) => q.id === result.question_id
                    );

                    return (
                      <Box
                        key={result.question_id}
                        p="4"
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={
                          result.is_correct ? "green.200" : "red.200"
                        }
                        bg={result.is_correct ? "green.50" : "red.50"}
                      >
                        <Text fontWeight="medium" mb="2">
                          Question {index + 1}: {result.question_text}
                        </Text>

                        {question &&
                          question.attachments &&
                          question.attachments.length > 0 &&
                          renderAttachments(question.attachments)}

                        {result.user_answer ? (
                          <Text fontSize="sm" color="gray.700" mb="1">
                            Your answer: {result.user_answer}
                          </Text>
                        ) : (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            mb="1"
                            fontStyle="italic"
                          >
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
                            as={result.is_correct ? FaCheck : FaTimes}
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
                    );
                  })}
                </VStack>

                <Flex justify="center" mt="6" gap="4">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                    }}
                  >
                    Close Results
                  </Button>
                  {hasNext && (
                    <Button
                      colorScheme="green"
                      rightIcon={<FaArrowRight />}
                      onClick={handleNextLesson}
                    >
                      Next Lesson
                    </Button>
                  )}
                </Flex>
              </VStack>
            </Box>
          )}

          {examStarted && !showResults && (
            <Box
              p="2rem"
              bg="white"
              borderRadius="0.75rem"
              boxShadow="md"
              w="80%"
              h="90%"
              overflowY="auto"
            >
              {assignmentComplete ? (
                <VStack spacing={6} align="center" justify="center">
                  <Icon as={FaCheckCircle} w={12} h={12} color="green.500" />
                  <Text fontSize="xl" textAlign="center">
                    You have already completed this assignment.
                  </Text>
                  <Button colorScheme="blue" onClick={showAssignmentResults}>
                    View Results
                  </Button>
                </VStack>
              ) : loadingQuestions ? (
                <Center h="full">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text>Loading questions...</Text>
                  </VStack>
                </Center>
              ) : questionError ? (
                <Alert status="error">
                  <AlertIcon />
                  {questionError}
                </Alert>
              ) : examData && examData.questions?.length > 0 ? (
                <VStack spacing="6" align="stretch">
                  <Box>
                    <Flex justify="space-between" mb="2">
                      <Text fontWeight="medium">
                        Question {currentQuestionIndex + 1} of{" "}
                        {examData.questions.length}
                      </Text>
                      <Text fontWeight="medium">
                        {getAnsweredQuestionsCount()} of{" "}
                        {examData.questions.length} answered
                      </Text>
                    </Flex>
                    <Progress
                      value={
                        ((currentQuestionIndex + 1) /
                          examData.questions.length) *
                        100
                      }
                      colorScheme="blue"
                      borderRadius="md"
                    />
                  </Box>

                  {examData.questions.length > 0 && (
                    <Box>
                      <Heading size="md" mb="4">
                        {examData.questions[currentQuestionIndex].question}
                        {examData.questions[currentQuestionIndex]
                          .is_required && (
                          <Text as="span" color="red.500" ml="1">
                            *
                          </Text>
                        )}
                      </Heading>

                      {renderAttachments(
                        examData.questions[currentQuestionIndex].attachments
                      )}

                      <RadioGroup
                        value={
                          selectedAnswers[
                            examData.questions[currentQuestionIndex].id
                          ] || ""
                        }
                        onChange={(value) =>
                          handleAnswerSelect(
                            examData.questions[currentQuestionIndex].id,
                            value
                          )
                        }
                        mt={4}
                      >
                        <Stack spacing="4">
                          {examData.questions[currentQuestionIndex].choices.map(
                            (choice) => (
                              <Box
                                key={choice.id}
                                p="3"
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor={
                                  selectedAnswers[
                                    examData.questions[currentQuestionIndex].id
                                  ] === choice.id
                                    ? "blue.500"
                                    : "gray.200"
                                }
                                bg={
                                  selectedAnswers[
                                    examData.questions[currentQuestionIndex].id
                                  ] === choice.id
                                    ? "blue.50"
                                    : "white"
                                }
                                _hover={{ bg: "gray.50" }}
                                cursor="pointer"
                                onClick={() =>
                                  handleAnswerSelect(
                                    examData.questions[currentQuestionIndex].id,
                                    choice.id
                                  )
                                }
                              >
                                <Radio value={choice.id} w="full">
                                  <Text>{choice.title}</Text>
                                </Radio>

                                {choice.attachments &&
                                  choice.attachments.length > 0 && (
                                    <Box mt={2} pl={6}>
                                      {renderAttachments(choice.attachments)}
                                    </Box>
                                  )}
                              </Box>
                            )
                          )}
                        </Stack>
                      </RadioGroup>
                    </Box>
                  )}

                  <Flex justify="space-between" mt="6">
                    <Button
                      leftIcon={<FaArrowLeft />}
                      onClick={prevQuestion}
                      isDisabled={currentQuestionIndex === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>

                    {currentQuestionIndex < examData.questions.length - 1 ? (
                      <Button
                        rightIcon={<FaArrowRight />}
                        onClick={nextQuestion}
                        colorScheme="blue"
                        isDisabled={
                          !isCurrentQuestionAnswered() &&
                          examData.questions[currentQuestionIndex].is_required
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        rightIcon={<FaCheck />}
                        onClick={handleSubmitExam}
                        colorScheme="green"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        isDisabled={!isExamComplete() || isSubmitting}
                      >
                        Submit Assignment
                      </Button>
                    )}
                  </Flex>
                </VStack>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  No questions available for this assignment.
                </Alert>
              )}
            </Box>
          )}

          {isTimerActive && !showResults && (
            <Flex
              position="fixed"
              top="4"
              right="4"
              bg="white"
              borderRadius="md"
              boxShadow="md"
              p="3"
              align="center"
              gap="2"
              zIndex="1000"
            >
              <FaClock color="#0248AB" />
              <Text fontWeight="bold">{formatTime(timer)}</Text>
            </Flex>
          )}
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You are about to start "{content.title}".</Text>
            <Text mt="3">
              This assignment has a time limit of {content.timer} minutes. Once
              you start, the timer cannot be paused.
            </Text>
            {assignmentComplete && (
              <Alert status="warning" mt="4">
                <AlertIcon />
                You have already completed this assignment. You cannot retake
                it.
              </Alert>
            )}
            {!assignmentComplete && (
              <Alert status="warning" mt="4">
                <AlertIcon />
                Make sure you have enough time to complete this assignment
                before starting.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={
                assignmentComplete
                  ? showAssignmentResults
                  : handleStartAssignment
              }
              isDisabled={assignmentComplete && !assignmentResults}
            >
              {assignmentComplete ? "View Results" : "Start Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {(!examStarted || contentType !== "assignment") && !showResults && (
        <Flex align="center" gap="8rem" w="full" alignSelf="stretch">
          <StyledBtn
            theme="blue"
            size="md"
            variant="outline"
            widthFull={true}
            style={{ flex: 1 }}
            onClick={onBack}
            isDisabled={!hasBack}
          >
            Back
          </StyledBtn>
          <StyledBtn
            theme="blue"
            size="md"
            variant="solid"
            widthFull={true}
            style={{ flex: 1 }}
            onClick={onNext}
            isDisabled={!hasNext}
          >
            Next
          </StyledBtn>
        </Flex>
      )}

      {(!examStarted || contentType !== "assignment") && !showResults && (
        <VStack spacing="5" alignItems="flex-start" w="full">
          <Heading fontSize="1.75rem" fontWeight="medium" w="full">
            {content.title}
          </Heading>

          <Divider />

          <Text fontSize="1rem" fontWeight="normal" color="#121212" w="full">
            {content.description || "No description available for this content"}
          </Text>
        </VStack>
      )}

      {contentType === "lesson" &&
        content.lesson_attachment &&
        content.lesson_attachment.length > 0 && (
          <VStack spacing="5" alignItems="flex-start" w="full">
            <Heading fontSize="1.5rem" fontWeight="medium" w="full">
              Lesson Materials
            </Heading>
            <Divider />
            <VStack spacing="4" w="full">
              {content.lesson_attachment.map((file, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  gap="3"
                  w="full"
                  p="3"
                  borderRadius="md"
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                >
                  {getFileIcon(file.type)}
                  <Text flex="1" fontSize="1rem" fontWeight="medium">
                    {file.title || getFilenameFromUrl(file.url)}
                  </Text>
                  <Button
                    as="a"
                    href={file.url}
                    target="_blank"
                    download
                    px="4"
                    py="2"
                    fontSize="0.875rem"
                    fontWeight="medium"
                    color="#0248AB"
                    borderRadius="0.75rem"
                    bg="rgba(2, 72, 171, 0.10)"
                    _hover={{
                      bg: "rgba(2, 72, 171, 0.15)",
                    }}
                    rightIcon={<FaFileDownload />}
                  >
                    Download
                  </Button>
                </Flex>
              ))}
            </VStack>
          </VStack>
        )}
    </Flex>
  );
};

export default ViewSection;
