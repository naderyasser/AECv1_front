import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  InputGroup,
  InputLeftAddon,
  Flex,
  Stack,
  Divider,
  ModalCloseButton,
} from "@chakra-ui/react";
import { BsArrowBarRight, BsSearch } from "react-icons/bs";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { useRef } from "react";
export const SearchModal = ({
  isOpen,
  onClose,
  onSubmit,
  children: results,
  isCentered,
  title,
  ...rest
}) => {
  const inputRef = useRef();
  return (
    <Modal
      motionPreset="slideInBottom"
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
    >
      <ModalOverlay />
      <ModalContent m="10px">
        <ModalBody>
          <InputGroup
            _placeholder={{ color: "blue.700" }}
            variant="flashed"
            w="100%"
            gap="1"
            size="lg"
            {...rest}
            onSubmit={(e) => {
              e.preventDefault();
              if (onSubmit) {
                onSubmit(inputRef.current.value);
                onClose();
              }
            }}
            as="form"
          >
            <InputLeftAddon
              borderRadius="full"
              as={Button}
              variant="ghost"
              type="submit"
              color="blue.700"
            >
              <BsSearch />
            </InputLeftAddon>
            <Input ref={inputRef} placeholder={title} />
          </InputGroup>
          <ModalCloseButton />
          {results && (
            <>
              <Divider color="gray.300" mt="2" mb="2" />
              <Stack
                className={styles["results-container"]}
                gap="2"
                maxH="400px"
                overflow="auto"
                p="10px"
              >
                {results?.map((result, index) => {
                  return (
                    <Button
                      flexShrink="0"
                      key={index}
                      bgColor="gray.100"
                      h="60px"
                      borderRadius="lg"
                      cursor="pointer"
                      transition="0.3s"
                      colorScheme="blue"
                      variant="ghost"
                      _hover={{
                        bgColor: "blue.600",
                        color: "gray.50",
                      }}
                      leftIcon={<BsSearch />}
                      rightIcon={<MdArrowOutward />}
                      justifyContent="space-between"
                      as={Link}
                      textTransform="capitalize"
                    >
                      {result?.title}
                    </Button>
                  );
                })}
              </Stack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
