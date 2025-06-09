import { Divider, Flex, Heading, Skeleton, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Pagination,
  SearchField,
  Title,
} from "../../../../../../Components/Common/Index";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { UserBox } from "./Components/UserBox";

export default function Index() {
  const [page, setPage] = useState(1);

  const Navigate = useNavigate();
  const [search] = useSearchParams();
  useEffect(() => {
    if (!search.get("Role")) {
      Navigate(`?Role=students`);
    }
  }, [search.get("Role")]);

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/panal/${search.get("Role")}/`,
    params: {
      page,
    },
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
        <Heading textTransform="capitalize" size="md">
          {search.get("Role")}
        </Heading>
        <SearchField size="lg">
          <Title>Search For {search.get("Role")}</Title>
        </SearchField>
      </Flex>
      <Divider />
      <Flex
        as={Skeleton}
        isLoaded={!loading}
        gap="3"
        justifyContent="center"
        flexWrap="wrap"
        minH="200px"
      >
        {data?.results?.map((item) => {
          return <UserBox user={item} key={item.id} onRender={HandleRender} />;
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
