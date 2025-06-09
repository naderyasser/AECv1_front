import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";

const ExamStart = ({ exam, onStartExam }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleStartExam = () => {
    onStartExam();
    onClose();
  };

  return (
    <Box
      p="2rem"
      bg="white"
      borderRadius="0.75rem"
      boxShadow="md"
      w="80%"
      alignSelf={"center"}
    >
      <Heading size="lg" mb="1rem" textAlign="center">
        Final Exam: {exam.title}
      </Heading>
      <Text mb="2rem" textAlign="center">
        {exam.description || "Complete this final exam to finish the course."}
      </Text>

      <Flex
        direction="column"
        align="center"
        gap="1rem"
        justifyContent={"center"}
      >
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          This exam has a time limit of {exam.timer} minutes
        </Alert>

        <Button
          mt="2rem"
          colorScheme="blue"
          leftIcon={<FaClock />}
          onClick={onOpen}
        >
          Start Final Exam
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Final Exam</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You are about to start "{exam.title}".</Text>
            <Text mt="3">
              This exam has a time limit of {exam.timer} minutes. Once you
              start, the timer cannot be paused.
            </Text>
            <Alert status="warning" mt="4">
              <AlertIcon />
              Make sure you have enough time to complete this exam before
              starting.
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleStartExam}>
              Start Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExamStart;
