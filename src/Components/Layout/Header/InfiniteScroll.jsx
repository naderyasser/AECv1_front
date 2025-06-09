import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
const marquee = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
`;

export const InfiniteSlider = ({ name, email, phone }) => {
  return (
    <Box
      overflow="hidden"
      whiteSpace="nowrap"
      position="relative"
      width="100%"
      bgGradient="linear(to-r, blue.50, gray.100)"
      p={4}
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex
        as="div"
        minWidth="100%"
        animation={`${marquee} 12s linear infinite`}
        gap={8}
        alignItems="center"
        px={8}
      >
        <Text fontSize="md" fontWeight="bold" color="blue.600">
          ✉️ Email: {email}
        </Text>
        <Text fontSize="md" fontWeight="bold" color="blue.600">
          👤 Name: {name}
        </Text>
        <Text fontSize="md" fontWeight="bold" color="blue.600">
          📞 Phone: {phone}
        </Text>
      </Flex>
    </Box>
  );
};
