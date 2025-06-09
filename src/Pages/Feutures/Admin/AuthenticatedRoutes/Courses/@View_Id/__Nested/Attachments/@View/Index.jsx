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
  Card,
  CardBody,
  CardFooter,
  Badge,
  Skeleton,
  Center,
  VStack,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaDownload,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaFolderOpen,
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
      title: getFileName(attachment.url),
    };
    setSelectedAttachment(enhancedAttachment);
    onOpen();
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      setIsDeleting(true);

      // Delete specific attachment
      await axiosInstance.delete(`/course-attachments/${attachmentId}/`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      toast({
        title: "Attachment deleted successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
      });

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
            >
              Download
            </Button>
          </Flex>
        );
    }
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={5}>
        Course Attachments
      </Heading>

      {!data?.course_attachment || data?.course_attachment?.length === 0 ? (
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
              No attachments found
            </Heading>
            <Text color="gray.600" textAlign="center">
              This course doesn't have any attachments yet. Attachments help
              enhance learning experience.
            </Text>
            <Button
              leftIcon={<FaFileImage />}
              colorScheme="blue"
              size="md"
              onClick={() => navigate(`/courses/${courseId}/update`)}
            >
              add attachments{" "}
            </Button>
          </VStack>
        </Center>
      ) : (
        <>
          <Text mb={4}>
            Total attachments: {data?.course_attachment?.length}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {data?.course_attachment?.map((attachment) => (
              <Card key={attachment.id} variant="outline" bg="white">
                <CardBody>
                  <Flex align="center" mb={3}>
                    {getFileIcon(attachment.url)}
                    <Heading size="md" ml={2} isTruncated>
                      {attachment.title}
                    </Heading>
                  </Flex>

                  <Badge
                    mb={3}
                    colorScheme={
                      getFileType(attachment.url) === "pdf"
                        ? "red"
                        : getFileType(attachment.url) === "image"
                        ? "green"
                        : "blue"
                    }
                  >
                    {getFileType(attachment.url).toUpperCase()}
                  </Badge>

                  <Text color="gray.600" fontSize="sm" isTruncated>
                    {attachment.url}
                  </Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Flex width="100%" justifyContent="space-between">
                    <Button
                      size="sm"
                      onClick={() => handlePreviewAttachment(attachment)}
                    >
                      Preview
                    </Button>
                    <IconButton
                      icon={<FaDownload />}
                      aria-label="Download attachment"
                      size="sm"
                      as="a"
                      href={attachment.url}
                      target="_blank"
                    />
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<FaTrash />}
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      isLoading={isDeleting}
                    >
                      Delete
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent
              maxW={selectedAttachment?.type === "image" ? "80vw" : "60vw"}
            >
              <ModalHeader>{selectedAttachment?.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {renderAttachmentPreview(selectedAttachment)}
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default Index;
