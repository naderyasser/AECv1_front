import { Button, Flex, Heading, Skeleton, Stack } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { CenteredTextWithLines } from "../../../Components/Common/Index";
import { useInView, useScroll } from "framer-motion";
import { useFetch } from "../../../Hooks/Index";

export default function Categories() {
  const { data, loading, error } = useFetch({
    endpoint: "categories",
  });
  return (
    <Stack alignItems="center" p="3">
      <CenteredTextWithLines
        w="100%"
        maxW="600px"
        transition="0.5s"
        dividerColor="gray.700"
      >
        <Heading flexShrink="0" size="lg">
          Trending Categories
        </Heading>
      </CenteredTextWithLines>
      <Flex
        flexWrap="wrap"
        justifyContent="center"
        as={Skeleton}
        isLoaded={!loading}
        mt="10"
        gap="4"
      >
        {data?.map((item) => {
          return (
            <Button
              colorScheme="blue"
              borderRadius="full"
              variant="outline"
              key={item.id}
            >
              {item.title}
            </Button>
          );
        })}
      </Flex>
    </Stack>
  );
}
