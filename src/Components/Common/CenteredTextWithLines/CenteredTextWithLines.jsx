import React, { useRef } from "react";
import { Box, Flex, Divider, Text } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { AnimatedText } from "../Index";

export const CenteredTextWithLines = ({
  children,
  TextAlign,
  dividerColor = "gray.400",
  ...rest
}) => {
  const ref = useRef();
  const inView = useInView(ref);
  return (
    <Flex ref={ref} gap="4" align="center" width="100%" {...rest}>
      <Divider
        w={TextAlign === "left" ? "20px" : "100%"}
        borderColor={dividerColor}
        sx={{
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "right",
        }}
        transition="0.5s"
      />
      <AnimatedText spacing="8px">{children}</AnimatedText>

      <Divider
        borderColor={dividerColor}
        w={TextAlign === "right" ? "20px" : "100%"}
        sx={{
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }}
        transition="0.5s"
      />
    </Flex>
  );
};
