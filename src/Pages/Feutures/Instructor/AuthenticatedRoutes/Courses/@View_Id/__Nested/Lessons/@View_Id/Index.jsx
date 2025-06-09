import {
  Button,
  Divider,
  Flex,
  Heading,
  Box,
  Text,
  IconButton,
  Spinner,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Container,
  VStack,
  HStack,
  AspectRatio,
  Progress,
  Link as ChakraLink,
  useToast,
  Tag,
} from "@chakra-ui/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import {
  FiEdit2,
  FiEye,
  FiClock,
  FiCalendar,
  FiHash,
  FiDownload,
  FiFile,
  FiExternalLink,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import React from "react";

function Index() {
  const { lessonId, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error, data } = useFetch({
    endpoint: `/lessons/${lessonId}/`,
  });
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to handle video playback errors
  const handleVideoError = (e) => {
    toast({
      title: "Video Error",
      description:
        "There was a problem loading the video. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="md" color="red.500">
          Error loading lesson data
        </Heading>
        <Text mt={4}>{error.message || "An unknown error occurred"}</Text>
        <Button
          mt={6}
          colorScheme="blue"
          onClick={() => navigate(`/courses/${id}/lessons`)}
          leftIcon={<FiArrowLeft />}
        >
          Back to Lessons
        </Button>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <HStack>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/courses/${id}/lessons`)}
            >
              Back to Lessons
            </Button>
            <Heading size="lg" textTransform="capitalize" noOfLines={1}>
              {data.title}
            </Heading>
            <Tag colorScheme={data.is_published ? "green" : "orange"} ml={2}>
              {data.is_published ? "Published" : "Draft"}
            </Tag>
          </HStack>
          <HStack>
            <IconButton
              as={Link}
              to={`update`}
              icon={<FiEdit2 />}
              colorScheme="blue"
              aria-label="Edit lesson"
              title="Edit lesson"
            />
          </HStack>
        </Flex>
        <Divider />
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box>
          <Card overflow="hidden" variant="outline" shadow="md">
            <CardHeader bg="blue.50" p={4}>
              <Heading size="md">Lesson Video</Heading>
            </CardHeader>
            <CardBody p={0} bg="black">
              {data.video_url ? (
                <AspectRatio ratio={16 / 9}>
                  <Box
                    as="video"
                    src={data.video_url}
                    controls
                    objectFit="contain"
                    onError={handleVideoError}
                    poster={data.thumbnail_url || ""}
                  />
                </AspectRatio>
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  bg="gray.100"
                  h="300px"
                  direction="column"
                  p={4}
                >
                  <FiAlertCircle size={40} color="#718096" />
                  <Text mt={4} color="gray.600" textAlign="center">
                    No video has been uploaded for this lesson
                  </Text>
                  <Button
                    as={Link}
                    to={`update`}
                    mt={4}
                    colorScheme="blue"
                    size="sm"
                  >
                    Upload Video
                  </Button>
                </Flex>
              )}
            </CardBody>
            {data.video_url && (
              <CardFooter bg="gray.50" justifyContent="space-between" py={2}>
                <Text fontSize="sm" color="gray.600">
                  Preview how students will see this video
                </Text>
                <Tag size="sm" colorScheme="blue">
                  {data.length || "Duration not available"}
                </Tag>
              </CardFooter>
            )}
          </Card>

          {data.lesson_attachment && data.lesson_attachment.length > 0 && (
            <Card overflow="hidden" variant="outline" shadow="md" mt={6}>
              <CardHeader bg="blue.50" p={4}>
                <Heading size="md">Lesson Attachments</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  {data.lesson_attachment.map((attachment) => (
                    <HStack
                      key={attachment.id}
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      justify="space-between"
                      _hover={{ bg: "gray.100" }}
                    >
                      <HStack spacing={3}>
                        <FiFile size={20} color="#4299E1" />
                        <Text noOfLines={1} maxW="250px">
                          {attachment.title || "Unnamed attachment"}
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<FiExternalLink />}
                          aria-label="View attachment"
                          size="sm"
                          variant="ghost"
                          as={ChakraLink}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View in new tab"
                        />
                        <IconButton
                          icon={<FiDownload />}
                          aria-label="Download attachment"
                          size="sm"
                          variant="ghost"
                          as={ChakraLink}
                          href={attachment.url}
                          download
                          title="Download file"
                        />
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
              <CardFooter bg="gray.50" justifyContent="flex-end">
                <Text fontSize="sm" color="gray.500">
                  {data.lesson_attachment.length} attachment
                  {data.lesson_attachment.length !== 1 ? "s" : ""}
                </Text>
              </CardFooter>
            </Card>
          )}

          {(!data.lesson_attachment || data.lesson_attachment.length === 0) && (
            <Card variant="outline" shadow="md" mt={6}>
              <CardBody>
                <Flex direction="column" align="center" justify="center" py={4}>
                  <FiFile size={30} color="#A0AEC0" />
                  <Text mt={3} color="gray.600" textAlign="center">
                    No attachments added to this lesson
                  </Text>
                  <Button
                    as={Link}
                    to={`update`}
                    mt={4}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                  >
                    Add Attachments
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          )}
        </Box>

        <VStack align="stretch" spacing={6}>
          <Card variant="outline" shadow="md">
            <CardHeader bg="blue.50" p={4}>
              <Heading size="md">Lesson Details</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Box w="120px" fontWeight="bold">
                    <HStack>
                      <FiHash />
                      <Text>ID:</Text>
                    </HStack>
                  </Box>
                  <Text>{data.id}</Text>
                </HStack>

                <HStack>
                  <Box w="120px" fontWeight="bold">
                    <HStack>
                      <FiCalendar />
                      <Text>Order:</Text>
                    </HStack>
                  </Box>
                  <Badge colorScheme="blue" fontSize="md" px={2}>
                    {data.order_id || 1}
                  </Badge>
                </HStack>

                <HStack>
                  <Box w="120px" fontWeight="bold">
                    <HStack>
                      <FiClock />
                      <Text>Length:</Text>
                    </HStack>
                  </Box>
                  <Badge colorScheme="green" fontSize="md" px={2}>
                    {data.length || "Not set"}
                  </Badge>
                </HStack>

                <HStack>
                  <Box w="120px" fontWeight="bold">
                    <HStack>
                      <FiCalendar />
                      <Text>Created:</Text>
                    </HStack>
                  </Box>
                  <Text>{formatDate(data.created_at)}</Text>
                </HStack>

                {data.updated_at && (
                  <HStack>
                    <Box w="120px" fontWeight="bold">
                      <HStack>
                        <FiCalendar />
                        <Text>Updated:</Text>
                      </HStack>
                    </Box>
                    <Text>{formatDate(data.updated_at)}</Text>
                  </HStack>
                )}

                <Divider />

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Description:
                  </Text>
                  <Text>{data.description || "No description provided"}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card variant="outline" shadow="md">
            <CardHeader bg="blue.50" p={4}>
              <Heading size="md">Student Access Limits</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold">Days Available:</Text>
                    <Text>{data.day_limit} days</Text>
                  </Flex>
                  <Progress
                    value={(data.day_limit / 30) * 100}
                    colorScheme="blue"
                    rounded="md"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Students can access this lesson for {data.day_limit} days
                    after enrollment
                  </Text>
                </Box>

                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold">View Limit:</Text>
                    <Text>{data.views_limit} views</Text>
                  </Flex>
                  <Progress
                    value={(data.views_limit / 100) * 100}
                    colorScheme="green"
                    rounded="md"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Students can watch this video up to {data.views_limit} times
                  </Text>
                </Box>
              </VStack>
            </CardBody>
            <CardFooter bg="gray.50" justifyContent="space-between">
              <HStack>
                <Badge colorScheme={data.is_published ? "green" : "orange"}>
                  {data.is_published ? (
                    <Flex align="center" gap={1}>
                      <FiCheck size={14} />
                      Published
                    </Flex>
                  ) : (
                    <Flex align="center" gap={1}>
                      <FiAlertCircle size={14} />
                      Draft
                    </Flex>
                  )}
                </Badge>
              </HStack>
              <Button
                as={Link}
                to={`update`}
                leftIcon={<FiEdit2 />}
                colorScheme="blue"
                size="sm"
              >
                Edit Lesson
              </Button>
            </CardFooter>
          </Card>
        </VStack>
      </SimpleGrid>
    </Container>
  );
}

export default Index;
