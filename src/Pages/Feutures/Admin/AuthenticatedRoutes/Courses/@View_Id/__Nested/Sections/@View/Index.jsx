import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import {
  SearchField,
  Title,
} from "../../../../../../../../../Components/Common/Index";
import { formatRelativeTime } from "../../../../../../../../../Utils/GetRelativeTime/GetRelativeTime";
import { Admin } from "../../../../../../../../../$Models/Admin";
const Section = ({ id, title, description, created_at, setSections }) => {
  const { id: CourseId } = useParams();
  const [loading, setLoading] = useState();
  const { HandleRender } = useOutletContext();

  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const HandleDelete = async () => {
    setLoading(true);
    const { data, error } = await Admin.Section.Delete({ id });
    if (error) {
      toast({
        title: "Error In Delete",
        status: "error",
      });
      return error;
    }
    setSections((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Deleted Successfully",
      status: "success",
    });
    if (HandleRender) {
      await HandleRender();
    }
    setLoading(false);
  };
  return (
    <AccordionItem bgColor="gray.50" key={id}>
      <h2>
        <AccordionButton>
          <Flex
            p="3"
            as="span"
            flex="1"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading fontWeight="normal" size="lg">
              {title}
            </Heading>
            <Text color="gray.800">
              {created_at && formatRelativeTime(created_at)}
            </Text>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb="4">
        <Text fontSize="lg" borderRadius="lg" p="3" bgColor="gray.100">
          {description}
        </Text>
        <Flex gap="3" mt="3">
          <Button
            as={Link}
            to={`/courses/${CourseId}/sections/${id}/update`}
            size="sm"
            colorScheme="green"
          >
            Update
          </Button>
          <Button
            isLoading={loading}
            onClick={HandleDelete}
            size="sm"
            colorScheme="red"
          >
            Delete
          </Button>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
export default function Index() {
  const { data, loading } = useOutletContext();
  const [seations, setSections] = useState([]);

  useEffect(() => {
    if (data?.sections) {
      setSections(data.sections);
    }
  }, [data]);

  return (
    <Stack p="3" bgColor="gray.50">
      <Flex
        alignItems="center"
        p="3"
        bgColor="white"
        justifyContent="space-between"
        wrap="wrap"
        gap="6"
      >
        <Heading size="md">Sections</Heading>
        <Flex gap="3">
          <Button as={Link} to="add" colorScheme="blue" variant="outline">
            Add A Section
          </Button>
          <SearchField>
            <Title>Search For A Course</Title>
          </SearchField>
        </Flex>
      </Flex>
      <Divider />
      <Stack
        as={Skeleton}
        isLoaded={!loading}
        minH="400px"
        borderRadius="lg"
        p="4"
        bgColor="white"
      >
        {seations.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" height="300px">
            <Text fontSize="lg" color="gray.500">
              No sections available. Click "Add A Section" to create one.
            </Text>
          </Flex>
        ) : (
          <Accordion allowMultiple>
            {seations.map((item) => {
              return (
                <Section {...item} key={item.id} setSections={setSections} />
              );
            })}
          </Accordion>
        )}
      </Stack>
    </Stack>
  );
}
