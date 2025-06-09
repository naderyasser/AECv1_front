import React from "react";
import { Box, Stack, Heading, Flex, Container, Text } from "@chakra-ui/react";
import AboutUs from "./Sections/AboutUs";
import { Footer } from "../../Components/Layout/Index";

export default function AboutUsPage() {
  React.useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Stack p="0" gap="0" overflow="hidden">
        {/* Hero Section for About Us Page */}
        <Box
          bg="blue.600"
          color="white"
          py={16}
          backgroundImage="linear-gradient(to right, #3182ce, #2b6cb0)"
        >
          <Container maxW="container.xl">
            <Flex direction="column" align="center" textAlign="center">
              {" "}
              <Heading as="h1" size="2xl" mb={4} fontWeight="bold">
                About Advanced Education Academy (AEC) Platform
              </Heading>
              <Text fontSize="xl" maxW="2xl">
                An educational platform that brings together students and
                teachers in various specializations from around the world
              </Text>
            </Flex>
          </Container>
        </Box>

        <Box py={8}>
          <AboutUs />
        </Box>
        <Footer />
      </Stack>
    </>
  );
}
