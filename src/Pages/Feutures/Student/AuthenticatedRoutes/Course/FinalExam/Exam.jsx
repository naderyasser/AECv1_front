import React from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Custom hook
import { useExam } from "./hooks/useExam";

// Components
import ExamTimer from "./components/ExamTimer";
import ExamStart from "./components/ExamStart";
import QuestionDisplay from "./components/QuestionDisplay";
import QuestionNavigation from "./components/QuestionNavigation";
import ExamResults from "./components/ExamResults";
import CompletedExam from "./components/CompletedExam";

const Exam = ({
  exam,
  examId,
  timer,
  isTimerActive,
  onStartTimer,
  formatTime,
  timeExpired,
}) => {
  const { id: courseId } = useParams();

  const {
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
  } = useExam(exam, examId, timeExpired);

  if (!exam) {
    return (
      <Center>
        <Text>No exam data available</Text>
      </Center>
    );
  }

  // Display if exam is already completed
  if (exam.is_done) {
    return (
      <CompletedExam
        onFinish={() => handleFinish(courseId)}
        onViewResults={fetchExamResults}
        onHideResults={() => setShowResults(false)}
        loadingResults={loadingResults}
        showResults={showResults}
        examResults={examResults}
      />
    );
  }

  if (!examStarted && !showResults) {
    return (
      <ExamStart
        exam={exam}
        onStartExam={() => {
          handleStartExam();
          onStartTimer();
        }}
      />
    );
  }

  if (showResults && examResults) {
    return (
      <ExamResults
        results={examResults}
        onFinish={() => handleFinish(courseId)}
      />
    );
  }

  return (
    <Box
      p="2rem"
      bg="white"
      borderRadius="0.75rem"
      boxShadow="md"
      w="80%"
      h="90%"
      overflowY="auto"
      position="relative"
      alignSelf={"center"}
    >
      {/* Display timer */}
      <ExamTimer
        time={formatTime(timer)}
        isActive={isTimerActive && !showResults}
      />

      {/* Question navigation and progress */}
      <QuestionNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={exam.questions.length}
        answeredCount={getAnsweredQuestionsCount()}
        isCurrentQuestionAnswered={isCurrentQuestionAnswered()}
        isExamComplete={isExamComplete()}
        onPrevious={prevQuestion}
        onNext={nextQuestion}
        onSubmit={handleSubmitExam}
        isSubmitting={isSubmitting}
      />

      {/* Current question display */}
      {exam.questions.length > 0 && (
        <QuestionDisplay
          question={exam.questions[currentQuestionIndex]}
          selectedAnswer={
            selectedAnswers[exam.questions[currentQuestionIndex].id]
          }
          onAnswerSelect={(choiceId) =>
            handleAnswerSelect(
              exam.questions[currentQuestionIndex].id,
              choiceId
            )
          }
        />
      )}
    </Box>
  );
};

export default Exam;
