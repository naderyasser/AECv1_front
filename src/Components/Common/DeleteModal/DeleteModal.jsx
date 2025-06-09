import React from "react";
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
  Stack,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import animationData from "../../../Assets/DeleteAnimation/wired-flat-185-trash-bin-hover-empty.json";
export const DeleteModal = ({ isOpen, onClose, onDelete, isLoading }) => {
  return (
    <Modal
      size="lg"
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are You Sure To Delete this Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack justifyContent="center" alignItems="center">
            <Lottie
              style={{
                width: "100%",
                maxWidth: "200px",
              }}
              animationData={animationData}
            />
          </Stack>
        </ModalBody>
        <ModalFooter gap="3">
          <Button
            isLoading={isLoading}
            variant="outline"
            colorScheme="blue"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={async () => {
              await onDelete();
              onClose();
            }}
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
