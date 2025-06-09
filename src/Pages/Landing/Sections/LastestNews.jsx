import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { CenteredTextWithLines } from "../../../Components/Common/Index";

export default function LastestNews() {
  return (
    <Stack gap="5" alignItems="center" p="3">
      <CenteredTextWithLines
        w="100%"
        maxW="600px"
        transition="0.5s"
        dividerColor="gray.700"
      >
        <Heading flexShrink="0" size="lg">
          Lastest News
        </Heading>
      </CenteredTextWithLines>
      <Stack bgColor="gray.100" w="100%" minH="400px"></Stack>
    </Stack>
  );
}
