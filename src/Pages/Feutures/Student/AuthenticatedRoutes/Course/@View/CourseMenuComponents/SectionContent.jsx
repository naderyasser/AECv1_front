import React from "react";
import { Flex, Text, Icon, Badge, Circle } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const SectionContent = ({ item, onContentSelect, isActive, icon }) => {
  const { id, title, type, sectionId, is_done } = item;

  const handleContentClick = () => {
    onContentSelect(sectionId, id, type);
  };

  const getStatusBadge = () => {
    if (is_done) {
      return (
        <Badge borderRadius="full" px="2" colorScheme="green" fontSize="0.7rem">
          Completed
        </Badge>
      );
    }
    return (
      <Badge borderRadius="full" px="2" colorScheme="blue" fontSize="0.7rem">
        Available
      </Badge>
    );
  };

  return (
    <Flex
      onClick={handleContentClick}
      cursor="pointer"
      alignItems="center"
      width="full"
      gap="1rem"
      borderRadius="0.75rem"
      border="1px solid"
      borderColor={isActive ? "blue.500" : "gray.100"}
      bg={isActive ? "rgba(2, 72, 171, 0.05)" : "white"}
      p="1rem"
      _hover={{
        bg: isActive ? "rgba(2, 72, 171, 0.05)" : "gray.50",
      }}
    >
      <Circle
        size="2.5rem"
        bg={is_done ? "green.100" : "blue.100"}
        color={is_done ? "green.500" : "blue.500"}
      >
        {is_done ? (
          <Icon as={FaCheckCircle} boxSize={4} />
        ) : (
          <Icon as={icon} boxSize={4} />
        )}
      </Circle>

      <Flex direction="column" flex="1">
        <Text
          fontSize="0.875rem"
          fontWeight={isActive ? "600" : "500"}
          color="black"
          noOfLines={1}
        >
          {title}
        </Text>
        <Flex mt="0.5rem" alignItems="center" justifyContent="space-between">
          <Text fontSize="0.75rem" color="gray.500" textTransform="capitalize">
            {type}
          </Text>
          {getStatusBadge()}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SectionContent;
