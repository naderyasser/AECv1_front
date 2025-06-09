import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Table,
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
        <ModalHeader>Add Category Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            {...register("title")}
            variant="filled"
            size="lg"
            placeholder="Category Title"
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
            Add Category
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
    endpoint: "categories",
  });
  const {
    onOpen: onOpenCategoryAddModal,
    onClose: onCloseCategoryAddModal,
    isOpen: isOpenCategoryAddModal,
  } = useDisclosure();

  const onSubmit = async ({ title }) => {
    const categoy_init = new Admin.Category({ title });
    const { data, error } = await categoy_init.Add();
    if (error) {
      return;
    }
    onCloseCategoryAddModal();
    toast({
      title: "Category Created Successfully",
      status: "success",
    });
    HandleRender();
  };

  const HandleDelete = async (id) => {
    const { error, data } = await Admin.Category.Delete({ id });
    if (error) {
      return;
    }
    HandleRender();
    toast({
      title: "Category Deleted Successfully",
      status: "success",
    });
  };
  const HandleUpdate = async (title, id) => {
    const Category_init = new Admin.Category({ title });
    const { error, data } = await Category_init.Update(id);
    if (error) {
      return;
    }
    toast({
      title: "Category Updated Successfully",
      status: "success",
    });
  };

  return (
    <>
      <CategoryRequestModal
        isOpen={isOpenCategoryAddModal}
        onClose={onCloseCategoryAddModal}
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
          <Heading size="md">Categories</Heading>
          <Flex gap="3">
            <SearchField size="lg">
              <Title>Search For A Category</Title>
            </SearchField>
            <Button onClick={onOpenCategoryAddModal} colorScheme="blue">
              Add A Category
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
