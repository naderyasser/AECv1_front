import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  SearchField,
  Title,
} from "../../../../../../../../../Components/Common/Index";
import { Link, useOutletContext } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import { formatRelativeTime } from "../../../../../../../../../Utils/GetRelativeTime/GetRelativeTime";
import { DeleteModal } from "../../../../../../../../../Components/Common/DeleteModal/DeleteModal";
import { Admin } from "../../../../../../../../../$Models/Admin";
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
  type,
  timer,
  time_tracker,
  unlocks_at,
  onRender,
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
  return (
    <>
      <DeleteModal
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onDelete={HandleDelete}
      />
      <Stack
        boxShadow="md"
        w="md"
        flexGrow="1"
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
        <Flex alignItems="center">
          <Heading size="md">{title}</Heading>
          <Button ml="auto" gap="3" variant="ghost">
            <BsClock size="15px" />
            <Text color="gray.600" fontSize="xs">
              {created_at && formatRelativeTime(created_at)}
            </Text>
          </Button>
        </Flex>
        <Divider mb="3" />

        <Field fieldName="Type" value={type?.name || "N/A"} />
        <Field fieldName="Timer" value={timer} />
        {time_tracker && (
          <Field
            fieldName="Time Tracker"
            value={formatRelativeTime(time_tracker)}
          />
        )}
        <Field fieldName="Unlocks At" value={formatRelativeTime(unlocks_at)} />

        <Flex gap="3" justifyContent="start" wrap="wrap" mt="2">
          <Button as={Link} to={id} colorScheme="blue" variant="outline">
            View
          </Button>
          <Button
            as={Link}
            to={`${id}/update`}
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
};

export default function Index() {
  const { data, loading } = useOutletContext();
  const [sections, setSections] = useState([]);

  const [sectionAssignments, setSectionAssignments] = useState({});
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState(null);

  const fetchSectionAssignments = async (sectionId) => {
    setAssignmentsLoading(true);
    try {
      const { error, data } = await Admin.Assigment.GetAll({
        section_id: sectionId,
      });
      if (error) {
        setAssignmentsError(error);
      } else {
        setSectionAssignments((prev) => ({
          ...prev,
          [sectionId]: data,
        }));
      }
    } catch (err) {
      setAssignmentsError(err);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const refreshAssignments = () => {
    if (sections && sections.length) {
      sections.forEach((section) => {
        fetchSectionAssignments(section.id);
      });
    }
  };

  useEffect(() => {
    if (data && data.sections) {
      setSections(data.sections);
      data.sections.forEach((section) => {
        fetchSectionAssignments(section.id);
      });
    }
  }, [data]);

  return (
    <Stack>
      <Flex
        alignItems="center"
        p="3"
        bgColor="white"
        justifyContent="space-between"
        wrap="wrap"
        gap="6"
      >
        <Heading size="md">Quizes</Heading>
        <Flex gap="3">
          <Button as={Link} to="add" colorScheme="blue">
            Add A Quiz
          </Button>
          <SearchField>
            <Title>Search For A Quiz</Title>
          </SearchField>
        </Flex>
      </Flex>
      <Divider />
      {sections.map((section) => (
        <Stack key={section.id} mb={6}>
          <Heading size="sm" p={3} bg="gray.50" borderRadius="md">
            {section.title}
          </Heading>
          <Flex
            wrap="wrap"
            as={Skeleton}
            isLoaded={!assignmentsLoading && !loading}
            minH="200px"
            gap="3"
          >
            {sectionAssignments[section.id]?.data.map(
              (item) => (
                console.log(item),
                (
                  <AssignmentBox
                    onRender={refreshAssignments}
                    key={item.id}
                    {...item}
                  />
                )
              )
            )}
            {sectionAssignments[section.id]?.data.length === 0 && (
              <Text p={4} color="gray.500">
                No quizzes available for this section
              </Text>
            )}
          </Flex>
        </Stack>
      ))}
      {assignmentsError && (
        <Text color="red.500">
          Error loading assignments: {assignmentsError.message}
        </Text>
      )}
    </Stack>
  );
}
