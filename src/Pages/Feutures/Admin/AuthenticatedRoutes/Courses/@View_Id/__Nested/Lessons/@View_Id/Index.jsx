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
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
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
} from "react-icons/fi";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";

function Index() {
  const { lessonId } = useParams();
  const { loading, error, data } = useFetch({
    endpoint: `/lessons/${lessonId}/`,
  });
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
        <Text mt={4}>{error.message}</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <HStack>
            <Heading
              size="md"
              textTransform="capitalize"
              noOfLines={1}
              w="100%"
            >
              {data.title}
            </Heading>
          </HStack>
          <HStack>
            {user?.data.role === "Admin" && (
              <IconButton
                as={Link}
                to={`update`}
                icon={<FiEdit2 />}
                colorScheme="blue"
                aria-label="Edit lesson"
              />
            )}
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
            <CardBody p={0}>
              <AspectRatio ratio={16 / 9}>
                <Box
                  as="video"
                  src={data.video_url}
                  controls
                  objectFit="cover"
                />
              </AspectRatio>
            </CardBody>
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
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                      justify="space-between"
                    >
                      <HStack>
                        <FiFile size={20} color="#4299E1" />
                        <Text noOfLines={1} maxW="250px">
                          {attachment.title}
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
                        />
                        <IconButton
                          icon={<FiDownload />}
                          aria-label="Download attachment"
                          size="sm"
                          variant="ghost"
                          as={ChakraLink}
                          href={attachment.url}
                          download
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
                    {data.order_id}
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
                    {data.length}
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

                <Divider />

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Description:
                  </Text>
                  <Text>{data.description}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card variant="outline" shadow="md">
            <CardHeader bg="blue.50" p={4}>
              <Heading size="md">Access Limits</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold">Days Limit:</Text>
                    <Text>{data.day_limit} days</Text>
                  </Flex>
                  <Progress
                    value={(data.day_limit / 30) * 100}
                    colorScheme="blue"
                    rounded="md"
                  />
                </Box>

                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold">Views Limit:</Text>
                    <Text>{data.views_limit} views</Text>
                  </Flex>
                  <Progress
                    value={(data.views_limit / 100) * 100}
                    colorScheme="green"
                    rounded="md"
                  />
                </Box>
              </VStack>
            </CardBody>
            <CardFooter bg="gray.50" justifyContent="flex-end">
              <HStack>
                <Button leftIcon={<FiEye />} variant="outline" size="sm">
                  Track Views
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </VStack>
      </SimpleGrid>
    </Container>
  );
}

export default Index;
