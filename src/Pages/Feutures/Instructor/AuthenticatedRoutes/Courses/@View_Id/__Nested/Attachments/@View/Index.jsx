import React, { useState } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  useToast,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Skeleton,
  Center,
  VStack,
  Card,
  CardBody,
  CardFooter,
  Link,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaDownload,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaFolderOpen,
  FaPlus,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axiosInstance from "../../../../../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";

const Index = () => {
  const { data, loading, error, HandleRender } = useOutletContext();
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // For delete confirmation dialog
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  if (loading) {
    return (
      <Box p={5}>
        <Skeleton height="40px" width="200px" mb={4} />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5}>
        <Text color="red.500">Error loading attachments: {error.message}</Text>
      </Box>
    );
  }

  // Helper function to determine file type from URL
  const getFileType = (url) => {
    if (!url) return "file";

    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return "image";
    if (extension === "pdf") return "pdf";
    if (["mp4", "webm", "mov", "avi"].includes(extension)) return "video";
    return "file";
  };

  const getFileIcon = (url) => {
    const type = getFileType(url);
    switch (type) {
      case "image":
        return <FaFileImage size={24} />;
      case "pdf":
        return <FaFilePdf size={24} />;
      case "video":
        return <FaFileVideo size={24} />;
      default:
        return <FaFile size={24} />;
    }
  };

  const getFileName = (url) => {
    if (!url) return "File";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handlePreviewAttachment = (attachment) => {
    // Enhance attachment with type information
    const enhancedAttachment = {
      ...attachment,
      type: getFileType(attachment.url),
      title: attachment.title || getFileName(attachment.url),
    };
    setSelectedAttachment(enhancedAttachment);
    onOpen();
  };

  const confirmDeleteAttachment = (attachment) => {
    setAttachmentToDelete(attachment);
    onDeleteDialogOpen();
  };

  const handleDeleteAttachment = async () => {
    if (!attachmentToDelete) return;

    try {
      setIsDeleting(true);

      // Delete specific attachment
      await axiosInstance.delete(
        `/course-attachments/${attachmentToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${
              user.data.token.access || user.data.token
            }`,
          },
        }
      );

      toast({
        title: "Attachment deleted successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
      });

      // Close the dialog
      onDeleteDialogClose();

      // Refresh data
      if (HandleRender) {
        await HandleRender();
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast({
        title: "Failed to delete attachment",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsDeleting(false);
      setAttachmentToDelete(null);
    }
  };

  const renderAttachmentPreview = (attachment) => {
    if (!attachment) return null;

    const type = attachment.type;

    switch (type) {
      case "image":
        return (
          <Image
            src={attachment.url}
            alt={attachment.title}
            maxH="70vh"
            objectFit="contain"
          />
        );
      case "pdf":
        return (
          <iframe
            src={attachment.url}
            style={{ width: "100%", height: "70vh" }}
            title={attachment.title}
          />
        );
      case "video":
        return (
          <video
            src={attachment.url}
            controls
            style={{ width: "100%", maxHeight: "70vh" }}
          />
        );
      default:
        return (
          <Flex direction="column" align="center" justify="center" p={10}>
            <FaFile size={50} />
            <Text mt={4}>{attachment.title}</Text>
            <Button
              as="a"
              href={attachment.url}
              target="_blank"
              leftIcon={<FaDownload />}
              mt={4}
              colorScheme="blue"
            >
              Download
            </Button>
          </Flex>
        );
    }
  };

  const hasAttachments =
    data?.course_attachment && data.course_attachment.length > 0;

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">Course Materials</Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          size="md"
          onClick={() => navigate(`/courses/${courseId}/update`)}
        >
          Add Materials
        </Button>
      </Flex>

      {!hasAttachments ? (
        <Center py={10}>
          <VStack
            spacing={4}
            p={8}
            borderRadius="lg"
            bg="gray.50"
            boxShadow="sm"
            width="100%"
            maxW="500px"
          >
            <FaFolderOpen size={60} color="#718096" />
            <Heading size="md" textAlign="center">
              No course materials
            </Heading>
            <Text color="gray.600" textAlign="center">
              Add downloadable resources like PDFs, images, or other files to
              enhance your students' learning experience.
            </Text>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              size="md"
              onClick={() => navigate(`/courses/${courseId}/update`)}
            >
              Add Course Materials
            </Button>
          </VStack>
        </Center>
      ) : (
        <>
          <Text mb={4} color="gray.600">
            {data?.course_attachment?.length} material
            {data?.course_attachment?.length !== 1 ? "s" : ""} available for
            students to download
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {data?.course_attachment?.map((attachment) => (
              <Card
                key={attachment.id}
                variant="outline"
                bg="white"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                transition="box-shadow 0.2s"
              >
                <CardBody>
                  <Flex align="center" mb={3}>
                    {getFileIcon(attachment.url)}
                    <Heading size="sm" ml={2} isTruncated>
                      {attachment.title || getFileName(attachment.url)}
                    </Heading>
                  </Flex>

                  <Badge
                    mb={3}
                    colorScheme={
                      getFileType(attachment.url) === "pdf"
                        ? "red"
                        : getFileType(attachment.url) === "image"
                        ? "green"
                        : getFileType(attachment.url) === "video"
                        ? "purple"
                        : "blue"
                    }
                  >
                    {getFileType(attachment.url).toUpperCase()}
                  </Badge>

                  <Text color="gray.500" fontSize="xs" noOfLines={1}>
                    {attachment.url}
                  </Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Flex width="100%" justifyContent="space-between">
                    <Tooltip label="Preview">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreviewAttachment(attachment)}
                      >
                        Preview
                      </Button>
                    </Tooltip>

                    <Tooltip label="Download">
                      <IconButton
                        icon={<FaDownload />}
                        aria-label="Download attachment"
                        size="sm"
                        variant="ghost"
                        as="a"
                        href={attachment.url}
                        target="_blank"
                      />
                    </Tooltip>

                    <Tooltip label="Delete">
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete attachment"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => confirmDeleteAttachment(attachment)}
                      />
                    </Tooltip>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>

          {/* Preview Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent
              maxW={selectedAttachment?.type === "image" ? "80vw" : "60vw"}
            >
              <ModalHeader>
                {selectedAttachment?.title}
                <Link
                  href={selectedAttachment?.url}
                  isExternal
                  color="blue.500"
                  fontSize="sm"
                  ml={2}
                >
                  <FaExternalLinkAlt size={12} />
                </Link>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {renderAttachmentPreview(selectedAttachment)}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            isOpen={isDeleteDialogOpen}
            leastDestructiveRef={cancelRef}
            onClose={onDeleteDialogClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Attachment
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this attachment? Students will
                  no longer have access to it.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteAttachment}
                    ml={3}
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Box>
  );
};

export default Index;
