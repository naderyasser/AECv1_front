import {
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFetch } from "../../../../../../Hooks/Index";
import {
  CourseCard,
  ErrorText,
  Pagination,
  SearchField,
  Title,
} from "../../../../../../Components/Common/Index";
import { Link } from "react-router-dom";
import { Admin } from "../../../../../../$Models/Admin";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
import { MdError, MdOutlineAddBox } from "react-icons/md";
import { FaBook } from "react-icons/fa";

const ExtendedCourseCard = ({ item, index, toaster, onRender, width }) => {
  const [isLoading, setLoading] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const HandleDelete = async () => {
    setLoading(true);
    const { error, data } = await Admin.Course.Delete({ id: item?.id });
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
      <CourseCard
        {...item}
        key={item.id}
        transition={`${(index + 1) * 0.2}s`}
        isLink={false}
        width={width}
      >
        <Flex gap="3" justifyContent="center" wrap="wrap" mt="2">
          <Button
            onClick={() =>
              localStorage.setItem("CourseData", JSON.stringify(item))
            }
            as={Link}
            to={`${item.id}/sections`}
            colorScheme="blue"
            variant="outline"
          >
            View
          </Button>
          <Button
            as={Link}
            to={`${item.id}/update`}
            colorScheme="green"
            variant="outline"
          >
            Edit
          </Button>
          <Button onClick={onOpen} colorScheme="red" variant="outline">
            Delete
          </Button>
        </Flex>
      </CourseCard>
    </>
  );
};

export default function Index() {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const [page, setPage] = useState(1);

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "courses",
    params: { page },
  });
  return (
    <Stack gap="3" p="5" w="100%" h="100%">
      <Flex
        wrap="wrap"
        p="2"
        justifyContent="space-between"
        alignItems="center"
        gap="5"
      >
        <Heading size="md">Courses</Heading>
        <Flex gap="3">
          <SearchField size="lg">
            <Title>Search For A Course</Title>
          </SearchField>
          <Button
            as={Link}
            to="add"
            colorScheme="blue"
            variant="outline"
            bgColor="white"
            leftIcon={<MdOutlineAddBox />}
          >
            Create A Course
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex
        gap="3"
        flexWrap="wrap"
        as={Skeleton}
        isLoaded={!loading}
        fadeDuration="3"
        borderRadius="lg"
        minH="500px"
        bgColor="white"
        justifyContent="center"
        alignItems="center"
        p="3"
      >
        {error ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            px={5}
            borderRadius="md"
            bg="red.50"
            w="100%"
            maxW="600px"
          >
            <Icon as={MdError} boxSize={12} color="red.500" mb={4} />
            <Heading size="md" mb={2} textAlign="center">
              Error Loading Courses
            </Heading>
            <ErrorText>
              {error?.message ||
                "There was an error loading the courses. Please try again."}
            </ErrorText>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={HandleRender}
              leftIcon={<MdOutlineAddBox />}
            >
              Try Again
            </Button>
          </Flex>
        ) : data?.results?.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            px={5}
            borderRadius="md"
            bg="blue.50"
            w="100%"
            maxW="600px"
          >
            <Icon as={FaBook} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2} textAlign="center">
              No Courses Found
            </Heading>
            <Text color="gray.600" textAlign="center" mb={4}>
              There are no courses available at the moment.
            </Text>
            <Button
              as={Link}
              to="add"
              colorScheme="blue"
              leftIcon={<MdOutlineAddBox />}
            >
              Create Your First Course
            </Button>
          </Flex>
        ) : (
          data?.results?.map((item, index) => {
            return (
              <ExtendedCourseCard
                toaster={toast}
                key={item.id}
                item={item}
                index={index}
                onRender={HandleRender}
                width={{ base: "100%", md: "47%", lg: "31%" }}
              />
            );
          })
        )}
      </Flex>
      {data?.pagination?.totalPages > 1 && (
        <Pagination
          isLoading={loading}
          totalPages={data?.pagination?.totalPages}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
        />
      )}
    </Stack>
  );
}
