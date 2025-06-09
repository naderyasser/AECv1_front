import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../../../../../../../axiosConfig/axiosInstance";
import { useNavigate } from "react-router-dom";

export const useExam = (exam, examId, timeExpired) => {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (timeExpired && examStarted && !showResults) {
      handleSubmitExam();
      toast({
        title: "Time's up!",
        description: "Your exam has been submitted automatically.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [timeExpired, examStarted, showResults]);

  const handleStartExam = () => {
    setExamStarted(true);
    return true;
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const nextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    if (!exam) return false;
    const currentQuestion = exam.questions[currentQuestionIndex];
    return !!selectedAnswers[currentQuestion.id];
  };

  const getAnsweredQuestionsCount = () => {
    if (!exam) return 0;
    return Object.keys(selectedAnswers).length;
  };

  const isExamComplete = () => {
    if (!exam) return false;

    const requiredQuestions = exam.questions.filter((q) => q.is_required);
    return requiredQuestions.every((q) => !!selectedAnswers[q.id]);
  };

  const formatAnswersForSubmission = () => {
    const formattedAnswers = [];

    if (exam && exam.questions) {
      exam.questions.forEach((question) => {
        const choiceId = selectedAnswers[question.id];

        if (choiceId) {
          const choice = question.choices.find((c) => c.id === choiceId);
          if (choice) {
            formattedAnswers.push({
              question_id: question.id,
              answer: choice.title,
            });
          }
        } else {
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
          assignment: examId,
        });
        console.log("Final Exam marked as done successfully");
      } catch (markError) {
        console.error("Error marking exam as done:", markError);
      }

      setShowResults(true);

      toast({
        title: "Exam submitted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast({
        title: "Error submitting exam",
        description: error.response?.data?.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = (courseId) => {
    navigate(`/watch-course/${courseId}`);
  };

  const fetchExamResults = async () => {
    try {
      setLoadingResults(true);
      const user = JSON.parse(localStorage.getItem("User"));

      const response = await axiosInstance.get(
        `/assignments/${examId}/results/`,
        {
          headers: user.data && {
            Authorization: `Bearer ${user?.data?.token?.access}`,
          },
        }
      );

      setExamResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      toast({
        title: "Error",
        description: "Failed to load exam results.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingResults(false);
    }
  };

  return {
    examStarted,
    currentQuestionIndex,
    selectedAnswers,
    isSubmitting,
    examResults,
    showResults,
    loadingResults,
    handleStartExam,
    handleAnswerSelect,
    nextQuestion,
    prevQuestion,
    isCurrentQuestionAnswered,
    getAnsweredQuestionsCount,
    isExamComplete,
    handleSubmitExam,
    handleFinish,
    fetchExamResults,
    setShowResults,
  };
};
