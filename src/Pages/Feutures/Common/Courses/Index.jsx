import {
  Flex,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery,
  Button,
  useDisclosure,
  IconButton,
  Skeleton,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Filteration } from "./Parts/Filteration";
import { useFetch } from "../../../../Hooks/Index";
import { HiOutlineBars3 } from "react-icons/hi2";
import { CourseCard, Pagination } from "../../../../Components/Common/Index";
export default function Index() {
  const [page, setPage] = useState(1);

  const [isPhoneQuery] = useMediaQuery("(max-width: 900px)");
  const { data, loading, error } = useFetch({
    endpoint: "courses/",
    params: {
      page: page,
      // Uncomment and use these when you have the filters working
      // level: search.levelsSelected.length > 0 ? search.levelsSelected.join(',') : undefined,
      // language: search.languagesSelected.length > 0 ? search.languagesSelected.join(',') : undefined,
      // price: search.priceType || "",
      // category: search.categoriesSeleacted.length > 0 ? search.categoriesSeleacted.join(',') : undefined,
    },
  });
  
  // Log any errors to help with debugging
  useEffect(() => {
    if (error) {
      console.error("Error loading courses:", error);
    }
  }, [error]);

  const [search, setSearch] = useState({
    sortBy: "",
    priceType: "Paid",
    priceRange: [],
    categoriesSeleacted: [],
    languagesSelected: [],
    authorsSelected: [],
    levelsSelected: [],
    statusSelected: [],
  });
  const HandleChangeSearch = ({ path, value }) => {
    console.log(path);
    setSearch((prev) => {
      return { ...prev, [path]: value };
    });
  };
  const HandleClear = () => {
    setSearch({
      sortBy: "",
      priceType: "Paid",
      priceRange: [],
      categoriesSeleacted: [],
      languagesSelected: [],
      authorsSelected: [],
      levelsSelected: [],
      statusSelected: [],
    });
  };
  const HandleAddItemToList = ({ path, value }) => {
    if (search[path].includes(value)) {
      return;
    }
    setSearch((prev) => {
      return { ...prev, [path]: [...search[path], value] };
    });
  };
  const HandleRemoveItemInList = ({ path, value }) => {
    setSearch((prev) => {
      return {
        ...prev,
        [path]: search[path].filter((item) => {
          return item !== value;
        }),
      };
    });
  };
  const HandleCheckIfItemExist = ({ path, value }) => {
    return search[path].includes(value);
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex gap="3" p="3" bgColor="gray.100">
      {isPhoneQuery ? (
        <Drawer size="md" isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filter</DrawerHeader>

            <DrawerBody>
              <Filteration
                onClear={HandleClear}
                onChange={HandleChangeSearch}
                onAddItemToList={HandleAddItemToList}
                onRemoveItemFromList={HandleRemoveItemInList}
                onCheckIfItemExist={HandleCheckIfItemExist}
                value={search}
              />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Filteration
          onClear={HandleClear}
          onChange={HandleChangeSearch}
          onAddItemToList={HandleAddItemToList}
          onRemoveItemFromList={HandleRemoveItemInList}
          onCheckIfItemExist={HandleCheckIfItemExist}
          value={search}
        />
      )}

      <Stack
        pos="relative"
        borderRadius="lg"
        bgColor="white"
        w="100%"
        h="fit-content"
      >
        {isPhoneQuery && (
          <IconButton
            onClick={onOpen}
            pos="absolute"
            top="3"
            left="3"
            colorScheme="blue"
            zIndex="10"
          >
            <HiOutlineBars3 />
          </IconButton>
        )}
        <Flex
          gap="3"
          flexWrap="wrap"
          as={Skeleton}
          isLoaded={!loading}
          fadeDuration="3"
          p="4"
          borderRadius="lg"
          justifyContent="center"
          minH="500px"
          h="100%"
          alignItems="start"
        >
          {error && (
            <Alert status="error" borderRadius="md" width="100%">
              <AlertIcon />
              Error loading courses. Please try refreshing the page or contact support.
            </Alert>
          )}
          
          {!error && data?.results?.length > 0 ? (
            data.results.map((item, index) => (
              <CourseCard
                {...item}
                key={item.id + item.title}
                transition={`${(index + 1) * 0.2}s`}
              />
            ))
          ) : !loading && !error ? (
            <Flex 
              direction="column" 
              alignItems="center" 
              justifyContent="center" 
              p="10" 
              textAlign="center" 
              color="gray.500"
              width="100%"
            >
              <Box fontSize="xl" mb="3">No courses found</Box>
              <Box fontSize="md">Try adjusting your filters or check back later</Box>
            </Flex>
          ) : null}
        </Flex>
        {/* Only show pagination if we have courses or the API returns pagination info */}
        {(data?.results?.length > 0 || data?.pagination?.totalResult > 0) && !error && (
          <Pagination
            isLoading={loading}
            totalPages={data?.pagination?.totalPages || Math.ceil((data?.pagination?.totalResult || 0) / (data?.pagination?.pageSize || 10)) || 1}
            currentPage={page}
            onChange={(newPage) => setPage(newPage)}
          />
        )}
      </Stack>
    </Flex>
  );
}
