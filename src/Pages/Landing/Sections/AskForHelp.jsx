import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import {
  AnimatedText,
  LazyLoadedImage,
} from "../../../Components/Common/Index";
import Icon from "../../../assets/Icons/Image.png";
export const AskForHelp = () => {
  return (
    <Stack
      p="5"
      gap="7"
      minH="300px"
      bgColor="black"
      justifyContent="center"
      alignItems="center"
    >
      <Flex gap="2" w="100%" justifyContent="center">
        <AnimatedText spacing="10px">
          <Heading color="white" textTransform="capitalize">
            Ask for help
          </Heading>
        </AnimatedText>
        <LazyLoadedImage src={Icon} />
        <Heading color="white">?</Heading>
      </Flex>
      <Button size="lg" colorScheme="red" borderRadius="lg">
        Contact Us
      </Button>
      <Text color="white">
        *You can send any question and it will be answered as soon as possible.
      </Text>
    </Stack>
  );
};
