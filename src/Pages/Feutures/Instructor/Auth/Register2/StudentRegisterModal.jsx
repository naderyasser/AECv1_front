import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import AnimationData from "../../../../../assets/RegisterationRequired/Animation.json";
import Lottie from "lottie-react";
import { SubmitButton } from "../../../../../Components/Common/Index";
import { Link } from "react-router-dom";
import { BaseNavigationHandler } from "../../../../../Utils/BaseNavigationHandler/BaseNavigationHandler";
console.log(AnimationData);
export const StudentRegisterModal = ({ isOpen }) => {
  return (
    <Modal size="2xl" isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p="5" gap="5" as={Stack} alignItems="center">
          <Lottie
            style={{
              width: "100%",
              maxWidth: "300px",
            }}
            animationData={AnimationData}
          />
          <Heading size="md" textAlign="center">
            You Have To Register First To Make An Application To Become A Tutor
          </Heading>
          <SubmitButton
            h="60px"
            borderRadius="full"
            size="lg"
            colorScheme="blue"
            onClick={() =>
              BaseNavigationHandler("./student/register?willBecomeTutor=true")
            }
          >
            Navigate To Registeration
          </SubmitButton>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
