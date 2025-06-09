import { Box, Text } from "@chakra-ui/react";
import styles from "./styles.module.css";
export const ErrorText = ({ children, color = "red.600", ...rest }) => {
  return (
    children && (
      <Box h="fit-content" overflow="hidden" {...rest}>
        <Text key={children} className={styles["error-text"]} color={color}>
          {children}
        </Text>
      </Box>
    )
  );
};
