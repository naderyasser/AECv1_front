import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import {
  CenteredTextWithLines,
  LazyLoadedImage,
} from "../../../Components/Common/Index";
import Image from "../../../assets/OurClients/Image.png";
export default function OurClients() {
  return (
    <Stack gap="7" p="3" alignItems="center">
      <CenteredTextWithLines
        w="100%"
        maxW="700px"
        transition="0.5s"
        dividerColor="gray.700"
      >
        <Heading size="lg" flexShrink="0">
          Top Compaines Choose AEC
        </Heading>
      </CenteredTextWithLines>
      <LazyLoadedImage src={Image} w="100%" maxW="800px" />
    </Stack>
  );
}
