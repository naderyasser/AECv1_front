import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  Spinner,
  Text,
  Center,
  Heading,
  Icon,
  Box,
} from "@chakra-ui/react";
import Exam from "./Exam";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../../../Hooks/Index";
import { RiGraduationCapLine } from "react-icons/ri";

const Index = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const examId = location.state?.examId;
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);

  const {
    loading,
    error,
    data: examData,
  } = useFetch({
    endpoint: `/assignment-details/${examId}/`,
  });

  useEffect(() => {
    if (!examId) {
      navigate(`/watch-course/${id}`);
    }
  }, [examId, id, navigate]);

  // Initialize timer when exam data is loaded
  useEffect(() => {
    if (examData && examData.timer) {
      setTimer(examData.timer * 60); // Convert minutes to seconds
    }
  }, [examData]);

  // Handle timer countdown
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      // Handle auto submission
      if (examData) {
        console.log("Time's up! Auto-submitting exam...");
        // The actual submission will be handled by the Exam component
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, isTimerActive, examData]);

  // Format time for display (HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    setIsTimerActive(true);
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Spinner size="xl" color="#0248AB" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="80vh">
        <Text>Error loading exam: {error.message}</Text>
      </Center>
    );
  }

  return (
    <Flex
      w={{ base: "90%", md: "60rem" }}
      alignItems="flex-center"
      justifyContent="center"
      margin={"0 auto"}
      padding={"3rem 0"}
      gap="2.5rem"
      flexDirection="column"
    >
      <Flex alignItems="center" justifyContent="center" gap="12px">
        <Heading fontSize="60px" fontWeight="700" color="#0248AB">
          Final Exam
        </Heading>
        <Icon as={RiGraduationCapLine} boxSize="80px" color="#0248AB" />
      </Flex>
      {examData && (
        <Exam
          exam={examData}
          examId={examId}
          timer={timer}
          isTimerActive={isTimerActive}
          onStartTimer={handleStartTimer}
          formatTime={formatTime}
          timeExpired={timer === 0 && isTimerActive === false}
        />
      )}
    </Flex>
  );
};

export default Index;
