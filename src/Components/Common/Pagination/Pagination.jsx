import React from "react";
import { HStack, Button, IconButton, Text, Skeleton } from "@chakra-ui/react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
  size,
}) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    // Show first page if it's not in the range
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push("...");
      }
    }

    // Show pages around the current page
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }

    // Show last page if it's not in the range
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <Button
          key={index}
          onClick={() => handlePageChange(page)}
          colorScheme={page === currentPage ? "blue" : "gray"}
          variant={page === currentPage ? "solid" : "outline"}
          size={{
            base: "sm",
            md: "md",
          }}
        >
          {page}
        </Button>
      ) : (
        <Text key={index} mx={2}>
          ...
        </Text>
      )
    );
  };

  return (
    <HStack
      sx={{
        direction: "ltr !important",
      }}
      spacing={2}
      justify="center"
      my={4}
      flexWrap="wrap"
    >
      <IconButton
        isLoading={isLoading}
        icon={<MdArrowLeft />}
        aria-label="Previous"
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        variant="outline"
        colorScheme="blue"
        size={{
          base: "sm",
          md: "md",
        }}
      />

      {renderPageNumbers()}

      <IconButton
        isLoading={isLoading}
        icon={<MdArrowRight />}
        aria-label="Next"
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        variant="outline"
        colorScheme="blue"
        size={{
          base: "sm",
          md: "md",
        }}
      />
    </HStack>
  );
};
