import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import {
  CenteredTextWithLines,
  LazyLoadedImage,
} from "../../../Components/Common/Index";
import { useFetch } from "../../../Hooks/Index";

export default function Instrctors() {
  return (
    <Stack gap="5" alignItems="center" p="3">
      <CenteredTextWithLines
        w="100%"
        maxW="600px"
        transition="0.5s"
        dividerColor="gray.700"
      >
        <Heading flexShrink="0" size="lg">
          Top Rated Instructors
        </Heading>
      </CenteredTextWithLines>
      <Stack bgColor="gray.100" w="100%" minH="400px"></Stack>
    </Stack>
  );
}
