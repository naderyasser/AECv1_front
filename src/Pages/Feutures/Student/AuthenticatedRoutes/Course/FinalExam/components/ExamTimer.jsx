import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";

const ExamTimer = ({ time, isActive }) => {
  if (!isActive) return null;

  return (
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
      <Text fontWeight="bold">{time}</Text>
    </Flex>
  );
};

export default ExamTimer;
