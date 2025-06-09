import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../../../Hooks/Index";
import { useEffect, useState } from "react";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
import { Link } from "react-router-dom";
import { Instructor } from "../../../../../../$Models/Instructor";

export default function Index() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/courses/course-details/${id}/`,
  });

  const HandleDelete = async () => {
    setLoading(true);
    const { error } = await Instructor.Course.Delete({ id });
    if (error) {
      toast({
        title: "Error In Deleting Course",
        status: "error",
      });
      onClose();
    } else {
      toast({
        title: "Course Deleted Successfully",
        status: "success",
      });
      onClose();
      navigate("/courses");
    }
    setLoading(false);
  };

  // Store course data in localStorage for other components to use
  useEffect(() => {
    if (data) {
      localStorage.setItem("CourseData", JSON.stringify(data));
    }
  }, [data]);

  if (error) {
    return (
      <Stack p="5">
        <Text color="red.500">Error loading course: {error.message}</Text>
        <Button onClick={HandleRender} colorScheme="blue">
          Try Again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack p="5" gap="3">
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        onDelete={HandleDelete}
        isLoading={isLoading}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="5"
      >
        <Box maxW="70%">
          <Stack>
            <Heading size="md" as={Skeleton} isLoaded={!loading}>
              {data?.title}
            </Heading>
          </Stack>
        </Box>
        <Stack gap="3" direction={["column", "row"]}>
          {/* <Button
            colorScheme="blue"
            as={Skeleton}
            isLoaded={!loading}
            onClick={() => window.open(`/courses/${id}`, "_blank")}
          >
            View Live
          </Button> */}
          <Button
            as={Link}
            to={`/courses/${id}/update`}
            colorScheme="green"
            variant="outline"
            isLoaded={!loading}
          >
            Edit
          </Button>
          <Button
            onClick={onOpen}
            colorScheme="red"
            variant="outline"
            isLoaded={!loading}
          >
            Delete
          </Button>
        </Stack>
      </Flex>
      <Divider />
      <Box>
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
            <Tab as={Link} to={`/courses/${id}/sections`}>
              Sections
            </Tab>
            <Tab as={Link} to={`/courses/${id}/lessons`}>
              Lessons
            </Tab>
            <Tab as={Link} to={`/courses/${id}/quizes`}>
              Quizes
            </Tab>
            <Tab as={Link} to={`/courses/${id}/attachments`}>
              Attachments
            </Tab>
            <Tab as={Link} to={`/courses/${id}/members`}>
              Members
            </Tab>
            <Tab as={Link} to={`/courses/${id}/userView`}>
              How Course Will look Like To User
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Box
        p="4"
        bgColor="white"
        borderRadius="lg"
        minH="70vh"
        border="1px"
        borderColor="gray.200"
      >
        <Outlet context={{ data, loading, error, HandleRender }} />
      </Box>
    </Stack>
  );
}
