import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  Pagination,
  SearchField,
  Title,
} from "../../../../../../../../../Components/Common/Index";

const MemberCard = ({ member }) => {
  return (
    <Card
      p={4}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      width="300px"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
    >
      <Flex direction="column" align="center" gap={3}>
        <Avatar size="xl" name={member.name} src={member.profile_pic} mb={2} />
        <Heading size="md">{member.name}</Heading>
        <Text color="gray.500">{member.email}</Text>

        <Flex wrap="wrap" gap={2} justify="center">
          <Badge
            colorScheme={
              member.role === "admin"
                ? "red"
                : member.is_instructor
                ? "purple"
                : "blue"
            }
          >
            {member.role === "admin"
              ? "Admin"
              : member.is_instructor
              ? "Instructor"
              : "Student"}
          </Badge>
          <Badge colorScheme={member.is_active ? "green" : "gray"}>
            {member.is_active ? "Active" : "Inactive"}
          </Badge>
        </Flex>

        <Text fontSize="sm" color="gray.500">
          Joined: {new Date(member.created_at).toLocaleDateString()}
        </Text>
      </Flex>
    </Card>
  );
};

const Index = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/courses/${id}/members/`,
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
        <Heading size="md">Course Members</Heading>
        <Flex gap="3">
          <SearchField size="lg">
            <Title>Search For A Member</Title>
          </SearchField>
          {/* <Button colorScheme="blue" variant="outline" bgColor="white">
            Add Member
          </Button> */}
        </Flex>
      </Flex>

      <Divider />

      <Flex
        gap="4"
        flexWrap="wrap"
        as={Skeleton}
        isLoaded={!loading}
        fadeDuration="3"
        borderRadius="lg"
        minH="500px"
        bgColor="white"
        justifyContent="center"
        alignItems="flex-start"
        p="4"
      >
        {data?.results?.length > 0 ? (
          data.results.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        ) : (
          <Text color="gray.500">No members found for this course</Text>
        )}
      </Flex>

      <Pagination
        isLoading={loading}
        totalPages={data?.pagination?.totalPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
};

export default Index;
