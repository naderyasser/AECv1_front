import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  SearchField,
  Title,
} from "../../../../../../Components/Common/Index";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { ApplicationCard } from "./Components/ApplicationCard";
import { useSearchParams } from "react-router-dom";

const App_Status = [
  {
    title: "in review",
    value: "in review",
    color: "orange",
  },
  {
    title: "accepted",
    value: "accepted",
    color: "green",
  },
  {
    title: "rejected",
    value: "rejected",
    color: "red",
  },
];
export default function Index() {
  const [search] = useSearchParams();
  const [statusSelected, setStatusSelected] = useState();
  useEffect(() => {
    setStatusSelected(search.get("status"));
  }, [search.get("status")]);
  const [page, setPage] = useState(1);
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "instractor-application",
    params: {
      page,
    },
  });
  console.log(data);
  return (
    <Stack gap="3" p="5" w="100%" h="100%">
      <Flex
        wrap="wrap"
        p="2"
        justifyContent="space-between"
        alignItems="center"
        gap="5"
      >
        <Heading size="md">Instructor Applciations</Heading>
        <SearchField size="lg">
          <Title>Search For A Application</Title>
        </SearchField>
      </Flex>

      <Divider borderColor="gray.300" />
      <Divider borderColor="gray.300" />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="lg"
        p="2"
        wrap="wrap"
        gap="5"
      >
        <Heading size="md">Status</Heading>
        <Flex as={Skeleton} isLoaded={!loading} justifyContent="start" gap="5">
          {App_Status.map((item) => {
            return (
              <Button
                bgColor={item.value !== statusSelected && "white"}
                colorScheme={item.color}
                variant={item.value === statusSelected ? "solid" : "outline"}
                key={item.value}
                textTransform="capitalize"
                onClick={() => setStatusSelected(item.value)}
              >
                {item.title}
              </Button>
            );
          })}
        </Flex>
      </Flex>
      <Divider borderColor="gray.300" />

      <Flex
        as={Skeleton}
        isLoaded={!loading}
        gap="5"
        justifyContent="center"
        flexWrap="wrap"
        minH="200px"
      >
        {data?.results?.map((item) => {
          return (
            <ApplicationCard {...item} key={item.id} onRender={HandleRender} />
          );
        })}
      </Flex>

      <Pagination
        isLoading={loading}
        totalPages={data?.pagination?.totalPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
