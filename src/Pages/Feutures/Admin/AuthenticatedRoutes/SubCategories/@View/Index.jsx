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
  title: z.string().min(1, { message: "Title is Required" }),
});
const CategoryRequestModal = ({ onClose, isOpen, onSubmit, defaultValues }) => {
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
        <ModalHeader>Add Sub Category Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            {...register("title")}
            variant="filled"
            size="lg"
            placeholder="Sub Category Title"
          />
          <ErrorText mt="2">{errors?.title?.message}</ErrorText>
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
            Add Sub Category
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
    endpoint: "sub-categories",
  });
  const {
    onOpen: onOpenSubCategoryAddModal,
    onClose: onCloseSubCategoryAddModal,
    isOpen: isOpenSubCategoryAddModal,
  } = useDisclosure();

  const onSubmit = async ({ title }) => {
    const categoy_init = new Admin.SubCategory({ title });
    const { data, error } = await categoy_init.Add();
    if (error) {
      return;
    }
    onCloseSubCategoryAddModal();
    toast({
      title: "Sub Categories Created Successfully",
      status: "success",
    });
    HandleRender();
  };

  const HandleDelete = async (id) => {
    const { error, data } = await Admin.SubCategory.Delete({ id });
    if (error) {
      return;
    }
    HandleRender();
    toast({
      title: "Sub Category Deleted Successfully",
      status: "success",
    });
  };
  const HandleUpdate = async (title, id) => {
    const Category_init = new Admin.SubCategory({ title });
    const { error, data } = await Category_init.Update(id);
    if (error) {
      return;
    }
    toast({
      title: " Sub Category Updated Successfully",
      status: "success",
    });
  };

  return (
    <>
      <CategoryRequestModal
        isOpen={isOpenSubCategoryAddModal}
        onClose={onCloseSubCategoryAddModal}
        onSubmit={onSubmit}
      />
      <Stack p="3">
        <Flex
          wrap="wrap"
          p="2"
          justifyContent="space-between"
          alignItems="center"
          gap="5"
        >
          <Heading size="md">Sub Categories</Heading>
          <Flex gap="3">
            <SearchField size="lg">
              <Title>Search For A Sub Category</Title>
            </SearchField>
            <Button onClick={onOpenSubCategoryAddModal} colorScheme="blue">
              Add A Sub Category
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
                <Th>Title</Th>
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
                          onSubmit={(title) => HandleUpdate(title, item.id)}
                          defaultValue={item.title}
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
