import React from "react";
import {
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Icon,
  Button,
} from "@chakra-ui/react";
import {
  FaAngleDown,
  FaAngleUp,
  FaFileDownload,
  FaFilePdf,
} from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";

const CourseMaterials = ({ attachments, isExpanded = true, onToggle }) => {
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "document":
      case "pdf":
        return <FaFilePdf size="1rem" />;
      default:
        return <GrDocumentText size="1rem" />;
    }
  };

  const getFilenameFromUrl = (url, title) => {
    if (title) return title;

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.substring(pathname.lastIndexOf("/") + 1);
    } catch (e) {
      return "file";
    }
  };

  return (
    <Box width="full" bg="white" boxShadow="md" borderRadius="md" p={3}>
      <Flex
        onClick={onToggle}
        cursor="pointer"
        width="full"
        justifyContent="space-between"
        alignItems="center"
        mb={isExpanded ? "1rem" : "0"}
      >
        <Text fontSize="1rem" fontWeight="600" color="black">
          Course Materials
        </Text>
        <Icon as={isExpanded ? FaAngleUp : FaAngleDown} boxSize={5} />
      </Flex>

      {isExpanded && (
        <VStack width="full" align="stretch" spacing="0.75rem" pl="1rem">
          {attachments.map((file, index) => (
            <Flex
              key={index}
              alignItems="center"
              width="full"
              borderRadius="0.75rem"
              border="1px solid"
              borderColor="gray.100"
              p="0.75rem"
              gap="0.5rem"
            >
              <Box p="0.5rem" color="gray.700">
                {getFileIcon(file.type)}
              </Box>
              <Text
                fontSize="0.875rem"
                fontWeight="400"
                color="black"
                flex="1"
                noOfLines={1}
              >
                {getFilenameFromUrl(file.url, file.title)}
              </Text>
              <Button
                as="a"
                href={file.url}
                target="_blank"
                download
                size="sm"
                color="#0248AB"
                bg="transparent"
                _hover={{ bg: "rgba(2, 72, 171, 0.05)" }}
                p="0"
                minW="auto"
              >
                <Icon as={FaFileDownload} boxSize={4} />
              </Button>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CourseMaterials;
