import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Box,
  Text,
  IconButton,
  useToast,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  SearchField,
  Title,
} from "../../../../../../../../../Components/Common/Index";
import { FiEdit2, FiEye, FiTrash2, FiEyeOff, FiCalendar } from "react-icons/fi";
import axiosInstance from "../../../../../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";

export default function Index() {
  const { data, loading, error, HandleRender } = useOutletContext();
  const { user } = useAuth();
  const toast = useToast();
  const cancelRef = useRef();
  const [sections, setSections] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (data && data.sections) {
      setSections(data.sections);
    }
  }, [data]);

  // Function to format time duration
  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    return duration;
  };

  // Handle delete lesson
  const handleDeleteClick = (lesson) => {
    setLessonToDelete(lesson);
    onOpen();
  };

  // Update UI after deletion
  const updateUIAfterDeletion = async (deletedLessonId) => {
    // Instead of manually updating the UI, we can refetch the data
    if (HandleRender) {
      await HandleRender();
    } else {
      // Fallback to the previous approach if refetch is not available
      setSections((prevSections) => {
        return prevSections.map((section) => ({
          ...section,
          lessons: section.lessons.filter(
            (lesson) => lesson.id !== deletedLessonId
          ),
        }));
      });
    }
  };

  const deleteLesson = async () => {
    if (!lessonToDelete) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/lessons/${lessonToDelete.id}/`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Lesson deleted",
        description: `"${lessonToDelete.title}" has been deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Update UI after deletion
      await updateUIAfterDeletion(lessonToDelete.id);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete lesson. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Stack p="3" bgColor="gray.50" spacing={4}>
      <Flex
        alignItems="center"
        p="3"
        bgColor="white"
        justifyContent="space-between"
        wrap="wrap"
        gap="6"
      >
        <Heading size="md">Course Lessons</Heading>
        <Flex gap="3">
          <Button as={Link} to="add" colorScheme="blue">
            Add New Lesson
          </Button>
          <SearchField>
            <Title>Search For A Lesson</Title>
          </SearchField>
        </Flex>
      </Flex>
      <Divider />

      {loading ? (
        <Flex justify="center" p={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : error ? (
        <Box p={4} bg="red.50" color="red.500" borderRadius="md">
          <Text>Failed to load lessons. Please try again.</Text>
        </Box>
      ) : sections && sections.length > 0 ? (
        sections.map((section) => (
          <Box key={section.id} mb={6}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              px={2}
            >
              <Heading size="md" color="blue.600">
                {section.title}
              </Heading>
              <Badge colorScheme="blue" fontSize="sm">
                {section.lessons?.length || 0} lessons
              </Badge>
            </Flex>

            {section.lessons && section.lessons.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {section.lessons
                  .sort((a, b) => a.order_id - b.order_id)
                  .map((lesson) => (
                    <Card
                      key={lesson.id}
                      borderRadius="lg"
                      overflow="hidden"
                      height="100%"
                      boxShadow="md"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "lg",
                      }}
                    >
                      <Box
                        bg="blue.50"
                        p={3}
                        borderBottom="1px"
                        borderColor="blue.100"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            Lesson {lesson.order_id}
                          </Badge>
                          <Badge
                            variant="outline"
                            colorScheme="gray"
                            fontSize="xs"
                          >
                            {formatDuration(lesson.length)}
                          </Badge>
                        </Flex>
                      </Box>

                      <CardBody py={4}>
                        <Heading
                          size="md"
                          mb={2}
                          noOfLines={1}
                          color="blue.700"
                        >
                          {lesson.title}
                        </Heading>

                        <Text
                          color="gray.600"
                          fontSize="sm"
                          noOfLines={2}
                          mb={4}
                        >
                          {lesson.description || "No description provided"}
                        </Text>

                        <Flex
                          justifyContent="space-between"
                          wrap="wrap"
                          gap={2}
                          bg="gray.50"
                          p={2}
                          borderRadius="md"
                        >
                          <Flex align="center" color="gray.500">
                            <FiEyeOff size={14} />
                            <Text ml={1} fontSize="xs" fontWeight="medium">
                              {lesson.views_limit} views
                            </Text>
                          </Flex>
                          <Flex align="center" color="gray.500">
                            <FiCalendar size={14} />
                            <Text ml={1} fontSize="xs" fontWeight="medium">
                              {lesson.day_limit} days
                            </Text>
                          </Flex>
                        </Flex>
                      </CardBody>

                      <CardFooter
                        bg="gray.50"
                        borderTop="1px"
                        borderColor="gray.200"
                        justifyContent="space-between"
                        alignItems="center"
                        py={2}
                        px={4}
                      >
                        <Flex gap={2} alignItems="center">
                          <Badge
                            colorScheme={
                              lesson.is_published ? "green" : "orange"
                            }
                            fontSize="xs"
                          >
                            {lesson.is_published ? "Published" : "Draft"}
                          </Badge>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(lesson.created_at).toLocaleDateString()}
                          </Text>
                        </Flex>
                        <Flex gap={1}>
                          <IconButton
                            icon={<FiEye />}
                            aria-label="View"
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            as={Link}
                            to={`${lesson.id}`}
                            borderRadius="full"
                            title="View lesson"
                          />
                          <IconButton
                            icon={<FiEdit2 />}
                            aria-label="Edit"
                            size="sm"
                            colorScheme="green"
                            variant="ghost"
                            as={Link}
                            to={`${lesson.id}/update`}
                            borderRadius="full"
                            title="Edit lesson"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete"
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteClick(lesson)}
                            borderRadius="full"
                            isLoading={
                              isDeleting && lessonToDelete?.id === lesson.id
                            }
                            title="Delete lesson"
                          />
                        </Flex>
                      </CardFooter>
                    </Card>
                  ))}
              </SimpleGrid>
            ) : (
              <Box p={4} bg="gray.100" borderRadius="md">
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={2}
                  gap={2}
                >
                  <Text color="gray.600">No lessons in this section yet.</Text>
                  <Button
                    as={Link}
                    to="add"
                    colorScheme="blue"
                    size="sm"
                    variant="outline"
                  >
                    Add Lesson to {section.title}
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        ))
      ) : (
        <Box p={8} textAlign="center" bg="white" borderRadius="md" shadow="sm">
          <Heading size="md" mb={4} color="blue.700">
            No Course Lessons
          </Heading>
          <Text fontSize="md" color="gray.600" mb={6}>
            You haven't added any lessons to this course yet. Start creating
            content by adding your first lesson.
          </Text>
          <Button as={Link} to="add" colorScheme="blue">
            Create Your First Lesson
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lesson
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{lessonToDelete?.title}"? This
              action cannot be undone and will remove all associated content.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteLesson}
                ml={3}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Stack>
  );
}
