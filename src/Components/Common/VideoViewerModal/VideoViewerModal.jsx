import {
  AspectRatio,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

export const VideoViewerModal = ({ onClose, isOpen, url, size = "lg" }) => {
  return (
    <Modal
      size={size}
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>مشاهدة الفيديو</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AspectRatio ratio={16 / 9}>
            <iframe src={url} allowFullScreen />
          </AspectRatio>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            غلق
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
