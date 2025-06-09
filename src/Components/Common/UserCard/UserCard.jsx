import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { MdEmail, MdPhone } from "react-icons/md";
import { useApiRequest } from "../../../Hooks/useApiRequest/useApiRequest";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
export const UserCard = ({
  _id,
  firstName,
  lastName,
  email,
  title,
  phone,
  isOAuthUser,
  role,
  active,
  emailVerified,
  onDeleteSuccess,
}) => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sendRequest: onDelete, loading } = useApiRequest();
  const toast = useToast();
  const handleDelete = async () => {
    try {
      await onDelete({
        url: `/users/${_id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      toast({
        title: "تم حذف المستخدم بنجاح.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      if (onDeleteSuccess) onDeleteSuccess(_id);
    } catch (error) {
      toast({
        title: "حدث خطأ أثناء حذف المستخدم.",
        description: error.response?.data?.message || "يرجى المحاولة لاحقاً.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      {/* User Card */}
      <Flex
        p={5}
        borderRadius="lg"
        bg="white"
        boxShadow="md"
        border="1px"
        borderColor="gray.200"
        direction="column"
        w="100%"
        maxW="400px"
        textAlign="right"
        dir="rtl"
      >
        <Flex align="center" mb={4}>
          <Avatar size="lg" name={`${firstName} ${lastName}`} ml={4} />
          <Box>
            <Text fontWeight="bold" fontSize="xl">
              {`${firstName} ${lastName}`}
            </Text>
            <Text fontSize="md" color="gray.500">
              {title || "لم يتم إدخال المسمى الوظيفي"}
            </Text>
          </Box>
        </Flex>

        <Box mb={4}>
          <Flex align="center" mb={2}>
            <Icon as={MdEmail} color="blue.500" ml={2} />
            <Text fontSize="md">{email}</Text>
          </Flex>
          <Flex align="center" mb={2}>
            <Icon as={MdPhone} color="green.500" ml={2} />
            <Text fontSize="md">{phone}</Text>
          </Flex>
          <Flex align="center" mb={2}>
            <Badge
              colorScheme={active ? "green" : "red"}
              variant="subtle"
              ml={2}
            >
              {active ? "نشط" : "غير نشط"}
            </Badge>
            <Badge
              colorScheme={emailVerified ? "green" : "yellow"}
              variant="subtle"
            >
              {emailVerified
                ? "البريد الإلكتروني مفعل"
                : "البريد الإلكتروني غير مفعل"}
            </Badge>
          </Flex>
          <Flex align="center" mb={2}>
            <Badge colorScheme="blue" variant="subtle" ml={2}>
              {(() => {
                if (role === "accountant") return "محاسب";
                if (role === "guest") return "ضيف";
                if (role === "companyOwner") return "صاحب شركة";
                if (role === "client") return "عميل";
                return "غير معروف";
              })()}
            </Badge>
            {isOAuthUser && (
              <Badge colorScheme="purple" variant="subtle">
                مستخدم OAuth
              </Badge>
            )}
          </Flex>
        </Box>

        <Flex justify="space-between" mt={4}>
          <Button colorScheme="blue" size="md" onClick={onOpen}>
            عرض التفاصيل
          </Button>
          <Button
            colorScheme="red"
            size="md"
            onClick={handleDelete}
            isLoading={loading}
          >
            حذف الحساب
          </Button>
        </Flex>
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تفاصيل المستخدم</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" textAlign="right" dir="rtl">
              <Text fontSize="lg" fontWeight="bold">
                الاسم: {`${firstName} ${lastName}`}
              </Text>
              <Text fontSize="md">البريد الإلكتروني: {email}</Text>
              <Text fontSize="md">الهاتف: {phone}</Text>
              <Text fontSize="md">المسمى الوظيفي: {title || "غير محدد"}</Text>
              <Text fontSize="md">
                الدور:{" "}
                {(() => {
                  if (role === "accountant") return "محاسب";
                  if (role === "guest") return "ضيف";
                  if (role === "companyOwner") return "صاحب شركة";
                  if (role === "client") return "عميل";
                  return "غير معروف";
                })()}
              </Text>
              <Text fontSize="md">الحالة: {active ? "نشط" : "غير نشط"}</Text>
              <Text fontSize="md">
                البريد الإلكتروني: {emailVerified ? "مفعل" : "غير مفعل"}
              </Text>
              {isOAuthUser && (
                <Text fontSize="md" color="purple.500">
                  هذا المستخدم سجل دخول بواسطة OAuth
                </Text>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
