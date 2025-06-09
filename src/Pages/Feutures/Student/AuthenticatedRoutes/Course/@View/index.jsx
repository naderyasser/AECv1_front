import React, { useState, useMemo, useEffect } from "react";
import { Flex, Spinner, Center, Text, Box } from "@chakra-ui/react";
import CourseMenu from "./CourseMenu";
import ViewSection from "./ViewSection";
import { useAuth } from "../../../../../../Context/UserDataProvider/UserDataProvider";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../../../../Hooks/Index";

const Index = ({
  containerWidth = "80rem",
  menuWidth = "25.75rem",
  customCourseData = null,
  customGap = "2.5rem",
}) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [courseDataState, setCourseDataState] = useState(null);
  const { id: courseId } = useParams();
  const { loading, error, data, HandleRender } = useFetch({
    endpoint: `/courses/course-details/${courseId ? courseId : courseId}/`,
  });

  // Use provided course data, local state, or fetched data
  const courseData = customCourseData || courseDataState || data;

  // Update local course data state when data changes
  useEffect(() => {
    if (data && !courseDataState) {
      setCourseDataState(data);
    }
  }, [data]);

  // Update the course data when a lesson or assignment is marked as complete
  const handleLessonComplete = (updatedContent) => {
    if (!updatedContent || !courseDataState) return;

    // Create a deep copy of the course data
    const updatedCourseData = JSON.parse(JSON.stringify(courseDataState));

    // Find the section containing this content (lesson or assignment)
    const sectionIndex = updatedCourseData.sections.findIndex(
      (section) => section.id === updatedContent.sectionId
    );

    if (sectionIndex !== -1) {
      if (updatedContent.type === "lesson") {
        // Find the lesson in the section
        const lessonIndex = updatedCourseData.sections[
          sectionIndex
        ].lessons.findIndex((lesson) => lesson.id === updatedContent.id);

        if (lessonIndex !== -1) {
          // Update the lesson's is_done property
          updatedCourseData.sections[sectionIndex].lessons[
            lessonIndex
          ].is_done = true;
        }
      } else if (updatedContent.type === "assignment") {
        // Find the assignment in the section
        const assignmentIndex = updatedCourseData.sections[
          sectionIndex
        ].assignments.findIndex(
          (assignment) => assignment.id === updatedContent.id
        );

        if (assignmentIndex !== -1) {
          // Update the assignment's is_done property
          updatedCourseData.sections[sectionIndex].assignments[
            assignmentIndex
          ].is_done = true;
        }
      }

      // Update the selected content to reflect the change
      setSelectedContent((prevSelected) => {
        if (prevSelected && prevSelected.id === updatedContent.id) {
          return { ...prevSelected, is_done: true };
        }
        return prevSelected;
      });

      // Update the course data state
      setCourseDataState(updatedCourseData);
    }

    // Refresh the data from the server eventually
    setRefreshCounter((prev) => prev + 1);
  };

  // Flatten course content for easier navigation
  const flatContent = useMemo(() => {
    if (!courseData || !courseData.sections) return [];

    // Gather all lessons and assignments from all sections
    const allContent = courseData.sections.reduce((acc, section) => {
      const contentItems = [];

      // Add lessons with metadata
      if (section.lessons && section.lessons.length > 0) {
        const sectionLessons = section.lessons.map((lesson) => ({
          ...lesson,
          sectionId: section.id,
          sectionTitle: section.title,
          type: "lesson",
        }));
        contentItems.push(...sectionLessons);
      }

      // Add assignments with metadata
      if (section.assignments && section.assignments.length > 0) {
        const sectionAssignments = section.assignments.map((assignment) => ({
          ...assignment,
          sectionId: section.id,
          sectionTitle: section.title,
          type: "assignment",
        }));
        contentItems.push(...sectionAssignments);
      }

      return [...acc, ...contentItems];
    }, []);

    // Sort by section order and then by internal order_id
    return allContent.sort((a, b) => {
      if (a.sectionId !== b.sectionId) {
        // Find section index for more natural ordering
        const aSectionIndex = courseData.sections.findIndex(
          (s) => s.id === a.sectionId
        );
        const bSectionIndex = courseData.sections.findIndex(
          (s) => s.id === b.sectionId
        );
        return aSectionIndex - bSectionIndex;
      }

      // Within same section, order by type (lessons first) then order_id
      if (a.type !== b.type) {
        return a.type === "lesson" ? -1 : 1;
      }

      // Within same type and section, use order_id
      return (a.order_id || 0) - (b.order_id || 0);
    });
  }, [courseData]);

  // Set default selected content
  useEffect(() => {
    if (!selectedContent && flatContent.length > 0) {
      setSelectedContent(flatContent[0]);
    }
  }, [flatContent, selectedContent]);

  const handleContentSelect = (
    sectionId,
    contentId,
    contentType = "lesson"
  ) => {
    const content = flatContent.find(
      (item) =>
        item.sectionId === sectionId &&
        item.id === contentId &&
        item.type === contentType
    );

    if (content) {
      setSelectedContent(content);
    }
  };

  const handleNavigation = (direction) => {
    const currentIndex = flatContent.findIndex(
      (item) =>
        item.id === selectedContent?.id &&
        item.sectionId === selectedContent?.sectionId
    );

    if (currentIndex === -1) return;

    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, flatContent.length - 1)
        : Math.max(currentIndex - 1, 0);

    setSelectedContent(flatContent[newIndex]);
  };

  if (loading) {
    return (
      <Center h="500px" w="full">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="500px" w="full">
        <Text color="red.500">
          Error loading course data. Please try again.
        </Text>
      </Center>
    );
  }

  return (
    <Flex
      w={containerWidth}
      alignItems="flex-start"
      margin={"0 auto"}
      padding={"3rem 0"}
      gap={customGap}
    >
      <CourseMenu
        course={courseData}
        onContentSelect={handleContentSelect}
        width={menuWidth}
        currentContent={selectedContent}
      />
      <ViewSection
        content={selectedContent}
        onNext={() => handleNavigation("next")}
        onBack={() => handleNavigation("back")}
        hasNext={
          selectedContent &&
          flatContent.indexOf(selectedContent) < flatContent.length - 1
        }
        hasBack={selectedContent && flatContent.indexOf(selectedContent) > 0}
        onLessonComplete={handleLessonComplete}
      />
    </Flex>
  );
};

export default Index;
