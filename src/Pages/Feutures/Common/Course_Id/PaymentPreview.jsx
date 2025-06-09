import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const PaymentPreview = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const toast = useToast();

  // Get payment status from URL parameters
  const paymentStatus = searchParams.get("status") || "";
  const transactionReference = searchParams.get("reference") || "";
  const courseId = searchParams.get("courseId") || "";

  useEffect(() => {
    // Simulate fetching payment details
    const fetchPaymentDetails = async () => {
      try {
        // For now, we'll just use the URL parameters
        setPaymentDetails({
          status: paymentStatus,
          reference: transactionReference,
          courseId: courseId,
          date: new Date().toLocaleString(),
        });

        setLoading(false);
      } catch (error) {
        toast({
          title: "Error fetching payment details",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentStatus, transactionReference, courseId, toast]);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading payment details...</Text>
      </Container>
    );
  }

  const renderPaymentStatus = () => {
    switch (paymentStatus.toLowerCase()) {
      case "success":
      case "paid":
      case "completed":
      case "successful":
        return (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={6}
          >
            <CheckCircleIcon boxSize={10} />
            <AlertTitle mt={4} mb={2} fontSize="lg">
              Payment Successful!
            </AlertTitle>
            <AlertDescription>
              Your payment has been processed successfully. You now have access
              to the course.
            </AlertDescription>
            <Button
              as={Link}
              to={`/courses/${courseId}/userView`}
              mt={4}
              colorScheme="green"
            >
              Go to Course
            </Button>
          </Alert>
        );

      case "pending":
      case "processing":
        return (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={6}
          >
            <InfoIcon boxSize={10} />
            <AlertTitle mt={4} mb={2} fontSize="lg">
              Payment Processing
            </AlertTitle>
            <AlertDescription>
              Your payment is currently being processed. This might take a few
              moments.
            </AlertDescription>
            <Button as={Link} to="/" mt={4} colorScheme="blue">
              Go to Dashboard
            </Button>
          </Alert>
        );

      case "failed":
      case "error":
      default:
        return (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={6}
          >
            <WarningIcon boxSize={10} />
            <AlertTitle mt={4} mb={2} fontSize="lg">
              Payment Failed
            </AlertTitle>
            <AlertDescription>
              We couldn't process your payment. Please try again or contact
              support.
            </AlertDescription>
            <Button as={Link} to="/" mt={4} colorScheme="red">
              Go to Dashboard
            </Button>
          </Alert>
        );
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Payment Status</Heading>

        {renderPaymentStatus()}

        {paymentDetails && (
          <Box mt={6} p={6} borderWidth={1} borderRadius="md">
            <Heading size="md" mb={4}>
              Transaction Details
            </Heading>
            <Text>
              <strong>Reference:</strong> {paymentDetails.reference}
            </Text>
            <Text>
              <strong>Date:</strong> {paymentDetails.date}
            </Text>
            <Text>
              <strong>Status:</strong> {paymentDetails.status}
            </Text>
            {paymentDetails.courseId && (
              <Text>
                <strong>Course ID:</strong> {paymentDetails.courseId}
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default PaymentPreview;
