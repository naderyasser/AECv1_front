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
import { Instructor } from "../../../../../../../../../$Models/Instructor";

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

const QuizBox = ({
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
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const HandleDelete = async () => {
    setLoading(true);
    const { error, data } = await Instructor.Assignment.Delete({ id: id });
    setLoading(false);
    if (error) {
      toaster({
        title: "Error in deleting quiz",
        description: error.message || "Something went wrong",
        status: "error",
      });
    } else {
      toaster({
        title: "Quiz deleted successfully",
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
  const [sectionQuizzes, setSectionQuizzes] = useState({});
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [quizzesError, setQuizzesError] = useState(null);

  const fetchSectionQuizzes = async (sectionId) => {
    setQuizzesLoading(true);
    try {
      const { error, data } = await Instructor.Assignment.GetAll({
        section_id: sectionId,
      });
      if (error) {
        setQuizzesError(error);
      } else {
        setSectionQuizzes((prev) => ({
          ...prev,
          [sectionId]: data,
        }));
      }
    } catch (err) {
      setQuizzesError(err);
    } finally {
      setQuizzesLoading(false);
    }
  };

  const refreshQuizzes = () => {
    if (sections && sections.length) {
      sections.forEach((section) => {
        fetchSectionQuizzes(section.id);
      });
    }
  };

  useEffect(() => {
    if (data && data.sections) {
      setSections(data.sections);
      data.sections.forEach((section) => {
        fetchSectionQuizzes(section.id);
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
        <Heading size="md">Course Quizzes</Heading>
        <Flex gap="3">
          <Button as={Link} to="add" colorScheme="blue">
            Add New Quiz
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
            isLoaded={!quizzesLoading && !loading}
            minH="200px"
            gap="3"
          >
            {sectionQuizzes[section.id]?.data?.map((item) => (
              <QuizBox onRender={refreshQuizzes} key={item.id} {...item} />
            ))}
            {(!sectionQuizzes[section.id]?.data ||
              sectionQuizzes[section.id]?.data.length === 0) && (
              <Text p={4} color="gray.500">
                No quizzes available for this section. Click "Add New Quiz" to
                create one.
              </Text>
            )}
          </Flex>
        </Stack>
      ))}

      {sections.length === 0 && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={10}
          gap={3}
        >
          <Text fontSize="lg" color="gray.500">
            This course doesn't have any sections yet. Create a section first
            before adding quizzes.
          </Text>
          <Button
            as={Link}
            to="../sections/add"
            colorScheme="blue"
            variant="outline"
          >
            Create Section
          </Button>
        </Flex>
      )}

      {quizzesError && (
        <Text color="red.500">
          Error loading quizzes: {quizzesError.message}
        </Text>
      )}
    </Stack>
  );
}
