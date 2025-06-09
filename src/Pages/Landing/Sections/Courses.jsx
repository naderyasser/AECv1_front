import {
  Container,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  AnimatedText,
  CenteredTextWithLines,
  CourseCard,
  LazyLoadedImage,
  Pagination,
} from "../../../Components/Common/Index";
import { useFetch } from "../../../Hooks/Index";
import ElapseShape from "../../../assets/Shapes/Image.png";

export default function Courses() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch({
    endpoint: "courses",
  });
  useFetch({
    endpoint: "/instractor-application",
  });
  return (
    <Stack p="3" pos="relative">
      <LazyLoadedImage
        zIndex="-1"
        pos="absolute"
        top="-20"
        right="-2"
        src={ElapseShape}
        sx={{
          transform: "rotateY(180deg)",
        }}
      />
      <Container p="3" w="100%" maxW="container.xl">
        <CenteredTextWithLines m="0 auto" w="100%" maxW="800px">
          <Heading color="gray.600" flexShrink="0" textAlign="center" size="lg">
            Feature Courses
          </Heading>
        </CenteredTextWithLines>
        <Spacer my="10" />
        <Flex
          gap="3"
          flexWrap="wrap"
          as={Skeleton}
          isLoaded={!loading}
          fadeDuration="3"
          p="4"
          bgColor="gray.50"
          borderRadius="lg"
          justifyContent="center"
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
        />
      </Container>
    </Stack>
  );
}
