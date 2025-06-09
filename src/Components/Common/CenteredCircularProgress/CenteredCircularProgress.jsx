import { CircularProgress } from "@chakra-ui/react";
import React from "react";

export const CenteredCircularProgress = ({ ...rest }) => {
  return (
    <CircularProgress
      isIndeterminate
      pos="fixed"
      top="50%"
      left="50%"
      sx={{
        translate: "-50% -50%",
        overflow: "hidden !important",
      }}
      {...rest}
    />
  );
};
