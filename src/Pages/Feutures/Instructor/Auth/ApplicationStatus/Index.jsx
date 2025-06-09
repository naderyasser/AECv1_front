import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  VStack,
  Button,
  Flex,
  Card,
  CardBody,
  Divider,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FormWrapper } from "../FormWrapper/FormWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import Lottie from "lottie-react";
import AnimationData from "../../../../../assets/Application/Animation.json";
import { switchUserRole } from "../../../../../Utils/RoleSwitcher/RoleSwitcher";

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { status } = useParams();

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Icon as={FaCheckCircle} color="green.500" boxSize="8" />;
      case "decline":
        return <Icon as={FaTimesCircle} color="red.500" boxSize="8" />;
      case "in review":
      default:
        return <Icon as={FaClock} color="orange.500" boxSize="8" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge colorScheme="green">Approved</Badge>;
      case "decline":
        return <Badge colorScheme="red">decline</Badge>;
      case "in review":
      default:
        return <Badge colorScheme="orange">In Review</Badge>;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your application has been approved. You can now access the instructor portal.";
      case "decline":
        return "We're sorry, but your instructor application was not approved at this time. You may reapply after addressing the feedback provided.";
      case "in review":
      default:
        return "Your application is currently being reviewed by our team. This process typically takes 2-3 business days. We'll notify you by email once a decision has been made.";
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case "approved":
        return "Application Approved!";
      case "decline":
        return "Application decline";
      case "in review":
      default:
        return "Application Under Review";
    }
  };

  const handleGoHome = () => {
    // Navigate to the home page
    switchUserRole("student", true);
  };

  return (
    <FormWrapper>
      <Stack
        spacing={8}
        p={5}
        maxW="800px"
        mx="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Instructor Application Status
          </Heading>
          <Text color="gray.600">
            View the current status of your instructor application
          </Text>
        </Box>

        <Flex
          justifyContent="center"
          alignItems="center"
          direction={{ base: "column", md: "row" }}
          spacing={8}
          gap={8}
        >
          <Box w={{ base: "100%", md: "50%" }}>
            <Lottie
              animationData={AnimationData}
              style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
            />
          </Box>

          <VStack
            spacing={4}
            align="stretch"
            w={{ base: "100%", md: "50%" }}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="outline" bg="white">
              <CardBody>
                <VStack spacing={4} align="center">
                  {getStatusIcon(status)}

                  <Heading size="md" textAlign="center">
                    {getStatusTitle(status)}
                  </Heading>

                  <Box>{getStatusBadge(status)}</Box>

                  <Divider />

                  <Text textAlign="center">{getStatusMessage(status)}</Text>

                  {status === "in review" && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Application In Process</AlertTitle>
                        <AlertDescription>
                          We`&apos;`re reviewing your credentials and
                          experience. We appreciate your patience.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  {status === "decline" && (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon as={FaExclamationTriangle} />
                      <Box>
                        <AlertTitle>Why applications get decline</AlertTitle>
                        <AlertDescription>
                          Common reasons include incomplete documentation,
                          insufficient experience, or misalignment with our
                          current instructor needs.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>

            <Flex justify="center" gap={4} mt={4}>
              {/* <Button
                leftIcon={<MdRefresh />}
                colorScheme="blue"
                onClick={handleRefresh}
              >
                Refresh Status
              </Button> */}

              <Button colorScheme="gray" onClick={handleGoHome}>
                Return to Home
              </Button>

              {status === "approved" && (
                <Button colorScheme="green" onClick={() => navigate("/")}>
                  Go to Instructor Portal
                </Button>
              )}

              {status === "decline" && (
                <Button
                  colorScheme="purple"
                  onClick={() => navigate("/register")}
                >
                  Apply Again
                </Button>
              )}
            </Flex>
          </VStack>
        </Flex>
      </Stack>
    </FormWrapper>
  );
}
