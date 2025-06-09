import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
  Text,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DeleteModal } from "../../../../../../../../../Components/Common/DeleteModal/DeleteModal";
import { Admin } from "../../../../../../../../../$Models/Admin";
import { BsClock } from "react-icons/bs";
import { formatRelativeTime } from "../../../../../../../../../Utils/GetRelativeTime/GetRelativeTime";
import { Link, Outlet, useParams } from "react-router-dom";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import { HiOutlineBars3 } from "react-icons/hi2";
const Field = ({ fieldName, value }) => {
  return (
    <Flex
      bgColor="gray.100"
      px="5"
      py="3"
      borderRadius="lg"
      alignItems="center"
      gap="3"
      justifyContent="space-between"
    >
      <Button w="100%" maxW="140px" borderRadius="full" colorScheme="blue">
        {fieldName}
      </Button>
      <Text fontWeight="bold">{value}</Text>
    </Flex>
  );
};
const AssignmentBox = ({
  title,
  id,
  created_at,
  is_done,
  is_exam,
  timer,
  time_tracker,
  unlocks_at,
  onRender,
  dataLoading,
}) => {
  const toaster = useToast();

  const [isLoading, setLoading] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const HandleDelete = async () => {
    setLoading(true);
    const { error, data } = await Admin.Assigment.Delete({ id: id });
    setLoading(false);
    if (error) {
      toaster({
        title: "Error In Delete Course",
        status: "error",
      });
      onClose();
      onRender();
    } else {
      toaster({
        title: "Course Deleted Successfully",
        status: "success",
      });
      onClose();
      onRender();
    }
  };
  const {
    onOpen: onExpand,
    onClose: onCollapse,
    isOpen: isExpanded,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  if (isExpanded) {
    return (
      <>
        <DeleteModal
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={onClose}
          onDelete={HandleDelete}
        />
        <Stack
          key={isExpanded}
          h="fit-content"
          as={Skeleton}
          isLoaded={!dataLoading}
          boxShadow="md"
          w="100%"
          p="3"
          borderRadius="lg"
          _hover={{
            transform: "translate(0, -5px)",
            boxShadow: "lg",
          }}
          transition="0.3s"
          border="1px"
          borderColor="gray.200"
        >
          <Flex gap="2" alignItems="center">
            <Heading size="md">{title}</Heading>
            <Button ml="auto" gap="3" variant="ghost">
              <BsClock size="15px" />
              <Text color="gray.600" fontSize="xs">
                {created_at && formatRelativeTime(created_at)}
              </Text>
            </Button>
            <IconButton onClick={onCollapse} w="fit-content">
              <HiOutlineBars3 />
            </IconButton>
          </Flex>
          <Divider mb="3" />

          <Field fieldName="is Done" value={is_done ? "Yes" : "No"} />
          <Field fieldName="is Exam" value={is_exam ? "Yes" : "No"} />
          <Field fieldName="Timer" value={timer} />
          <Field
            fieldName="Time Tracker"
            value={time_tracker && formatRelativeTime(time_tracker)}
          />
          <Field
            fieldName="Unlocks At"
            value={unlocks_at && formatRelativeTime(unlocks_at)}
          />

          <Flex gap="3" justifyContent="start" wrap="wrap" mt="2">
            <Button
              as={Link}
              to={`update`}
              colorScheme="green"
              variant="outline"
            >
              Edit
            </Button>
            <Button onClick={onOpen} colorScheme="red" variant="outline">
              Delete
            </Button>
          </Flex>
        </Stack>
      </>
    );
  } else {
    return (
      <IconButton onClick={onExpand} w="fit-content">
        <HiOutlineBars3 />
      </IconButton>
    );
  }
};

export default function Index() {
  const { quizId } = useParams();
  const { loading, error, data, HandleRender } = useFetch({
    endpoint: `assignments/${quizId}`,
  });

  return (
    <Flex
      wrap={{
        base: "wrap",
        lg: "nowrap",
      }}
      gap="3"
      p="4"
    >
      <AssignmentBox dataLoading={loading} {...data} />
      <Stack
        border="1px"
        borderColor="gray.200"
        p="3"
        boxShadow="md"
        _hover={{
          boxShadow: "lg",
        }}
        w="100%"
        borderRadius="lg"
      >
        <Flex
          wrap="wrap"
          mb="8"
          borderRadius="lg"
          gap="4"
          bgColor="gray.50"
          p="3"
        >
          <Button flexGrow="1" as={Link} to="questions" colorScheme="blue">
            Questions
          </Button>
          <Button flexGrow="1" as={Link} to="AddQuestions" colorScheme="blue">
            Add Questions Of Assignment
          </Button>
        </Flex>

        {!window.location.pathname.includes("/questions") &&
          !window.location.pathname.includes("/AddQuestions") && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              p={8}
              borderRadius="md"
              bg="gray.50"
              border="1px dashed"
              borderColor="gray.300"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="gray.600"
                textAlign="center"
              >
                Please select one of the options above to manage questions or
                add new ones.
              </Text>
              <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                Click on "Questions" to view all questions or "Add Questions Of
                Assignment" to create new ones.
              </Text>
            </Flex>
          )}

        <Stack p="5">
          <Outlet />
        </Stack>
      </Stack>
    </Flex>
  );
}
