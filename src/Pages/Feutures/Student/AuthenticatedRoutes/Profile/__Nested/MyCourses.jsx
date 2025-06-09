import { Box, Container, Flex, Heading, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFetch } from "../../../../../../Hooks/Index";
import {
  CourseCard,
  Pagination,
} from "../../../../../../Components/Common/Index";

const MyCourses = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useFetch({
    endpoint: "courses",
  });

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Students also bought
        </Heading>
        <Flex
          gap="3"
          flexWrap="wrap"
          as={Skeleton}
          isLoaded={!loading}
          fadeDuration="3"
          p="4"
          bgColor="gray.50"
          borderRadius="lg"
          justifyContent="start"
          minH="500px"
        >
          {data?.results?.map((item, index) => {
            return (
              <CourseCard
                {...item}
                key={item.id}
                transition={`${(index + 1) * 0.2}s`}
              />
            );
          })}
        </Flex>
        <Pagination
          isLoading={loading}
          totalPages={data?.pagination?.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </Box>
    </Container>
  );
};

export default MyCourses;
