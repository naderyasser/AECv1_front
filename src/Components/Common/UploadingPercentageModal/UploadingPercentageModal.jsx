import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Progress,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaFileUpload, FaCheckCircle } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";

export const UploadProgressModal = ({
  isOpen,
  fileName,
  fileSize,
  uploadProgress = 0,
  status = "uploading",
}) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "green.500";
      case "error":
        return "red.500";
      default:
        return "blue.500";
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case "success":
        return <Icon as={FaCheckCircle} color="green.500" w={8} h={8} />;
      case "error":
        return <Icon as={AiOutlineCloseCircle} color="red.500" w={8} h={8} />;
      default:
        return <Icon as={FaFileUpload} color="blue.500" w={8} h={8} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading file";
      case "success":
        return "Upload complete";
      case "error":
        return "Upload failed";
      default:
        return "";
    }
  };

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl" maxWidth="400px" p={4}>
        <ModalHeader>
          <HStack spacing={3} align="center">
            {renderStatusIcon()}
            <Text fontWeight="bold">{getStatusText()}</Text>
          </HStack>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} width="full">
            <VStack spacing={2} width="full" align="flex-start">
              <Text fontSize="sm" fontWeight="semibold">
                {fileName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {formatFileSize(fileSize)}
              </Text>
            </VStack>

            <Progress
              value={uploadProgress}
              width="full"
              colorScheme={status === "uploading" ? "blue" : status}
              size="sm"
              borderRadius="full"
            />

            <HStack width="full" justifyContent="space-between">
              <Text fontSize="sm" fontWeight="medium" color={getStatusColor()}>
                {status === "uploading"
                  ? `Uploaded ${uploadProgress}%`
                  : status === "success"
                  ? "Upload successful"
                  : "Upload failed"}
              </Text>
              {status !== "uploading" && (
                <Button
                  size="sm"
                  colorScheme={status === "success" ? "green" : "red"}
                >
                  {status === "success" ? "Close" : "Retry"}
                </Button>
              )}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
