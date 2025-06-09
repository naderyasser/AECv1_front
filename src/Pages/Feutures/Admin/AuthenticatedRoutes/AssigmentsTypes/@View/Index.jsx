import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useToast,
  Skeleton,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Pagination,
  SearchField,
  Title,
} from "../../../../../../Components/Common/Index";
import { useApiRequest, useFetch } from "../../../../../../Hooks/Index";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin } from "../../../../../../$Models/Admin";
import { useAxiosTracker } from "../../../../../../Hooks/useAxiosTracker/useAxiosTracker";
import { formatRelativeTime } from "../../../../../../Utils/GetRelativeTime/GetRelativeTime";

const schema = z.object({
  name: z.string().min(1, { message: "Title is Required" }),
});
const AssigmentRequestModal = ({
  onClose,
  isOpen,
  onSubmit,
  defaultValues,
}) => {
  const isLoading = useAxiosTracker();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Assigment Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            {...register("name")}
            variant="filled"
            size="lg"
            placeholder="Assigment Type Name"
          />
          <ErrorText mt="2">{errors?.name?.message}</ErrorText>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            isLoading={isLoading}
            variant="outline"
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
          >
            Add Assigment Type
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Index() {
  const isLoading = useAxiosTracker();

  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { loading, error, data, HandleRender } = useFetch({
    endpoint: "assignment-types",
  });
  const {
    onOpen: onOpenAssigmentAddModal,
    onClose: onCloseAssigmentAddModal,
    isOpen: isOpenAssigmentAddModal,
  } = useDisclosure();

  const onSubmit = async ({ name }) => {
    const assignment_type_init = new Admin.Assigment.Type({ name });
    const { data, error } = await assignment_type_init.Add();
    if (error) {
      return;
    }
    onCloseAssigmentAddModal();
    toast({
      title: "Assigment Created Successfully",
      status: "success",
    });
    HandleRender();
  };

  const HandleDelete = async (id) => {
    const { error, data } = await Admin.Assigment.Type.Delete({ id });
    if (error) {
      return;
    }
    HandleRender();
    toast({
      title: "Assigment Deleted Successfully",
      status: "success",
    });
  };
  const HandleUpdate = async (name, id) => {
    const Assigment_Type_init = new Admin.Assigment.Type({ name });
    const { error, data } = await Assigment_Type_init.Update(id);
    if (error) {
      return;
    }
    toast({
      title: "Assigment Updated Successfully",
      status: "success",
    });
  };

  return (
    <>
      <AssigmentRequestModal
        isOpen={isOpenAssigmentAddModal}
        onClose={onCloseAssigmentAddModal}
        onSubmit={onSubmit}
        key={isOpenAssigmentAddModal}
      />
      <Stack p="3">
        <Flex
          wrap="wrap"
          p="2"
          justifyContent="space-between"
          alignItems="center"
          gap="5"
        >
          <Heading size="md">Assigments Types</Heading>
          <Flex gap="3">
            <SearchField size="lg">
              <Title>Search For An Assignment Type </Title>
            </SearchField>
            <Button onClick={onOpenAssigmentAddModal} colorScheme="blue">
              Add An Assigment Type
            </Button>
          </Flex>
        </Flex>
        <Divider borderColor="gray.300" />
        <TableContainer
          bgColor="white"
          borderRadius="lg"
          minH="400px"
          as={Skeleton}
          isLoaded={!loading}
        >
          <Table size="lg" variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Created At</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item) => {
                return (
                  <>
                    <Tr key={item.id}>
                      <Td>
                        <Editable
                          onSubmit={(name) => HandleUpdate(name, item.id)}
                          defaultValue={item.name}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Td>

                      <Td>
                        {item.created_at && formatRelativeTime(item.created_at)}
                      </Td>

                      <Td>
                        <Button
                          isLoading={isLoading}
                          colorScheme="red"
                          onClick={async () => await HandleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  </>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
