import { Hero } from "./Sections/Hero";
import Courses from "./Sections/Courses";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { AskForHelp } from "./Sections/AskForHelp";
import Categories from "./Sections/Categories";
import Instrctors from "./Sections/Instrctors";
import LastestNews from "./Sections/LastestNews";
import OurClients from "./Sections/OurClients";
import { Footer } from "../../Components/Layout/Index";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <Stack p="0" gap="0" overflow="hidden">
        <Hero />
        <Courses />
        <AskForHelp />
        <Categories />
        <Instrctors />{" "}
        <Box py={10} textAlign="center" bg="blue.50">
          <Heading size="lg" mb={4}>
            Learn More About Our Platform
          </Heading>
          <Text fontSize="lg" mb={6}>
            Discover more details about the Advanced Education Academy (AEC)
            platform and its services
          </Text>
          <Button
            as={Link}
            to="/about-us"
            colorScheme="blue"
            size="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition="all 0.3s ease"
          >
            More About Platform
          </Button>
        </Box>
        <LastestNews />
        <OurClients />
        <Footer />
      </Stack>
    </>
  );
}
