import React from "react";
import { Box, Heading, Text, RadioGroup, Radio, Stack } from "@chakra-ui/react";

const QuestionDisplay = ({ question, selectedAnswer, onAnswerSelect }) => {
  if (!question) return null;

  return (
    <Box>
      <Heading size="md" mb="4">
        {question.question}
        {question.is_required && (
          <Text as="span" color="red.500" ml="1">
            *
          </Text>
        )}
      </Heading>

      {question.attachments && question.attachments.length > 0 && (
        <Box mb="4">
          {question.attachments.map((attachment) => (
            <Box key={attachment.id} mb="2">
              {attachment.type === "image" && (
                <img
                  src={attachment.url}
                  alt={attachment.title}
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}

      <RadioGroup value={selectedAnswer || ""} onChange={onAnswerSelect}>
        <Stack spacing="4">
          {question.choices.map((choice) => (
            <Box
              key={choice.id}
              p="3"
              borderWidth="1px"
              borderRadius="md"
              borderColor={
                selectedAnswer === choice.id ? "blue.500" : "gray.200"
              }
              bg={selectedAnswer === choice.id ? "blue.50" : "white"}
              _hover={{ bg: "gray.50" }}
              cursor="pointer"
              onClick={() => onAnswerSelect(choice.id)}
            >
              <Radio value={choice.id} w="full">
                <Text>{choice.title}</Text>
              </Radio>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default QuestionDisplay;
