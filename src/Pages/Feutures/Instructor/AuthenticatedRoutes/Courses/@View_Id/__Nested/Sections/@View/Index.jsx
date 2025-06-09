import {
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
  Box,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  SimpleGrid,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { Link, useOutletContext } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import { Instructor } from "../../../../../../../../../$Models/Instructor";
import { FaEdit, FaTrash, FaPlus, FaLayerGroup } from "react-icons/fa";

export default function Index() {
  const { data, loading, HandleRender } = useOutletContext() || {};
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    onOpen();
  };

  const handleDeleteSection = useCallback(async () => {
    if (!sectionToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await Instructor.Section.Delete({
        id: sectionToDelete.id,
      });

      if (error) {
        toast({
          title: "Error deleting section",
          description:
            error.message || "There was an error deleting the section",
          status: "error",
        });
      } else {
        toast({
          title: "Section deleted",
          description: "The section has been successfully deleted",
          status: "success",
        });
        HandleRender();
      }
    } catch (err) {
      toast({
        title: "Error deleting section",
        description: err.message || "There was an unexpected error",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }, [sectionToDelete, toast, HandleRender, onClose]);

  return (
    <Stack spacing={6}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
        <Heading size="md">Course Sections</Heading>
        <Button
          as={Link}
          to="add"
          colorScheme="blue"
          leftIcon={<FaPlus />}
          isLoading={loading}
        >
          Add Section
        </Button>
      </Flex>

      <Divider />

      <Box as={Skeleton} isLoaded={!loading} mt={4}>
        {data?.sections && data.sections.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {data.sections.map((section) => (
              <Card
                key={section.id}
                variant="outline"
                boxShadow="sm"
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{ boxShadow: "md" }}
              >
                <CardHeader>
                  <Heading size="md" noOfLines={2}>
                    {section.title}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text noOfLines={3}>{section.description}</Text>

                  <Stack mt={4} spacing={2}>
                    <Flex align="center" color="gray.600">
                      <Icon as={FaLayerGroup} mr={2} />
                      <Text fontSize="sm">
                        {section.lessons?.length || 0} Lessons
                      </Text>
                    </Flex>
                  </Stack>
                </CardBody>
                <CardFooter>
                  <ButtonGroup spacing={2}>
                    <Button
                      as={Link}
                      to={`${section.id}/update`}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      leftIcon={<FaEdit />}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      leftIcon={<FaTrash />}
                      onClick={() => handleDeleteClick(section)}
                      isLoading={
                        isDeleting && sectionToDelete?.id === section.id
                      }
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Box p={8} textAlign="center" borderRadius="md" bg="blue.50">
            <Icon as={FaLayerGroup} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>
              No Sections Yet
            </Heading>
            <Text color="gray.600" mb={4}>
              Start creating sections to organize your course content.
            </Text>
            <Button as={Link} to="add" colorScheme="blue" leftIcon={<FaPlus />}>
              Add Your First Section
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Section
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the section "
              {sectionToDelete?.title}"? This action cannot be undone and all
              associated content will be removed.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteSection}
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
