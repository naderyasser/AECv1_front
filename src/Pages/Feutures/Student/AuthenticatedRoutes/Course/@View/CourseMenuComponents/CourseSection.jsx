import React from "react";
import { Box, VStack, Flex, Text, Icon, Badge, Circle } from "@chakra-ui/react";
import {
  FaAngleDown,
  FaAngleUp,
  FaBook,
  FaTasks,
  FaCheckCircle,
} from "react-icons/fa";
import SectionContent from "./SectionContent";

const CourseSection = ({
  section,
  sectionIndex,
  isExpanded = false,
  onToggle,
  onContentSelect,
  currentContent,
}) => {
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
          Section {sectionIndex + 1}: {section.title}
        </Text>
        <Icon as={isExpanded ? FaAngleUp : FaAngleDown} boxSize={5} />
      </Flex>

      {isExpanded && (
        <VStack width="full" align="stretch" spacing="1rem" pl="1rem">
          {/* Lessons List */}
          {section.lessons?.map((lesson) => (
            <SectionContent
              key={`lesson-${lesson.id}`}
              item={{
                ...lesson,
                type: "lesson",
                sectionId: section.id,
                sectionTitle: section.title,
              }}
              onContentSelect={onContentSelect}
              isActive={
                currentContent?.id === lesson.id &&
                currentContent?.sectionId === section.id &&
                currentContent?.type === "lesson"
              }
              icon={FaBook}
            />
          ))}

          {/* Assignments List */}
          {section.assignments?.map((assignment) => (
            <SectionContent
              key={`assignment-${assignment.id}`}
              item={{
                ...assignment,
                type: "assignment",
                sectionId: section.id,
                sectionTitle: section.title,
              }}
              onContentSelect={onContentSelect}
              isActive={
                currentContent?.id === assignment.id &&
                currentContent?.sectionId === section.id &&
                currentContent?.type === "assignment"
              }
              icon={FaTasks}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CourseSection;
