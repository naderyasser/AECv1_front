import React, { useState, useMemo } from "react";
import { Box, Progress, VStack, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CourseProgress from "./CourseMenuComponents/CourseProgress";
import CourseMaterials from "./CourseMenuComponents/CourseMaterials";
import CourseSection from "./CourseMenuComponents/CourseSection";
import FinalExam from "./CourseMenuComponents/FinalExam";

const CourseMenu = ({
  course,
  onContentSelect,
  width = "25.75rem",
  currentContent,
}) => {
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  const handleSectionToggle = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleFinalExamClick = () => {
    if (course?.final_exam) {
      navigate(`/watch-course/${course.id}/finalExam`, {
        state: { examId: course.final_exam },
      });
    }
  };

  const calculateProgress = useMemo(() => {
    if (!course || !course.sections) return 0;

    let totalItems = 0;
    let completedItems = 0;

    course.sections.forEach((section) => {
      if (section.lessons) {
        totalItems += section.lessons.length;
        completedItems += section.lessons.filter(
          (lesson) => lesson.is_done
        ).length;
      }

      if (section.assignments) {
        totalItems += section.assignments.length;
        completedItems += section.assignments.filter(
          (assignment) => assignment.is_done
        ).length;
      }
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [course]);

  if (!course) return null;

  return (
    <Box
      borderRadius="0.75rem"
      bg="white"
      boxShadow="0px 0px 9px 0px rgba(18, 18, 18, 0.12)"
      display="flex"
      width={width}
      height="62.5rem"
      padding="2rem 1.5rem"
      flexDirection="column"
      alignItems="flex-start"
      gap="2rem"
      flexShrink={0}
      overflowY="auto"
    >
      <VStack width="full" align="flex-start" spacing="1rem">
        <Text fontSize="1.5rem" fontWeight="600" color="black" width="full">
          {course.title}
        </Text>
      </VStack>

      <CourseProgress progress={calculateProgress} />

      {course.course_attachment && course.course_attachment.length > 0 && (
        <CourseMaterials
          attachments={course.course_attachment}
          isExpanded={expandedSections["course_materials"]}
          onToggle={() => handleSectionToggle("course_materials")}
        />
      )}

      {course.sections?.map((section, sectionIndex) => (
        <CourseSection
          key={section.id}
          section={section}
          sectionIndex={sectionIndex}
          isExpanded={expandedSections[section.id]}
          onToggle={() => handleSectionToggle(section.id)}
          onContentSelect={onContentSelect}
          currentContent={currentContent}
        />
      ))}

      <FinalExam
        hasFinalExam={!!course?.final_exam}
        onClick={handleFinalExamClick}
      />
    </Box>
  );
};

export default CourseMenu;
