import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Progress,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  SkeletonText,
  Spinner,
  Button,
  HStack,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {
  FaUserGraduate,
  FaBookOpen,
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaCertificate,
  FaClock,
  FaDownload,
  FaComments,
  FaQuestionCircle,
  FaCheckCircle,
  FaUserClock,
} from "react-icons/fa";
import { useFetch } from "../../../../../Hooks/Index";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";

const Index = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = React.useState("all");
  const [selectedCourse, setSelectedCourse] = React.useState("all");

  // Fetch instructor-specific analytics data
  const { data: analyticsData, loading } = useFetch({
    endpoint: `/instructor/${user?.data?.user?.id}/analytics/`,
    params: {
      time_range: timeRange,
      course_id: selectedCourse !== "all" ? selectedCourse : undefined,
    },
  });

  // Fetch instructor courses for the dropdown
  const { data: coursesData, loading: coursesLoading } = useFetch({
    endpoint: `/instructor/${user?.data?.user?.id}/courses/`,
  });

  // Colors for cards
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleColor = useColorModeValue("gray.600", "gray.400");

  // Custom stat card component with loading state
  const StatCard = ({ title, value, icon, description, color, isLoading }) => (
    <Card
      bg={cardBg}
      boxShadow="md"
      borderRadius="lg"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
    >
      <CardBody>
        <Flex align="center" mb={2}>
          <Box
            p={2}
            borderRadius="md"
            bg={`${color}.100`}
            color={`${color}.500`}
            mr={4}
          >
            <Icon as={icon} boxSize={6} />
          </Box>
          <Box width="full">
            <Text fontSize="md" color={subtleColor} fontWeight="bold">
              {title}
            </Text>
            {isLoading ? (
              <Skeleton height="32px" width="80px" mt={1} />
            ) : (
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {value !== null && value !== undefined ? value : "0"}
              </Text>
            )}
          </Box>
        </Flex>
        {description &&
          (isLoading ? (
            <SkeletonText mt={2} noOfLines={1} skeletonHeight="3" width="80%" />
          ) : (
            <Text fontSize="sm" color={subtleColor} mt={2}>
              {description}
            </Text>
          ))}
      </CardBody>
    </Card>
  );

  // Loading state for progress metrics card
  const StudentEngagementMetrics = () => {
    if (loading) {
      return (
        <Box>
          <Skeleton height="20px" mb={4} />
          <Skeleton height="10px" mb={8} />
          <Skeleton height="20px" mb={4} />
          <Skeleton height="10px" mb={8} />
          <Skeleton height="20px" mb={4} />
          <Skeleton height="10px" />
        </Box>
      );
    }

    return (
      <>
        <Box mb={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Course Completion Rate</Text>
            <Text>{analyticsData?.completion_rate || 0}%</Text>
          </Flex>
          <Progress
            value={analyticsData?.completion_rate || 0}
            max={100}
            colorScheme="blue"
            borderRadius="full"
          />
        </Box>

        <Box mb={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Student Engagement</Text>
            <Text>{analyticsData?.engagement_rate || 0}%</Text>
          </Flex>
          <Progress
            value={analyticsData?.engagement_rate || 0}
            max={100}
            colorScheme="green"
            borderRadius="full"
          />
        </Box>

        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Assignment Submission Rate</Text>
            <Text>{analyticsData?.assignment_completion_rate || 0}%</Text>
          </Flex>
          <Progress
            value={analyticsData?.assignment_completion_rate || 0}
            max={100}
            colorScheme="purple"
            borderRadius="full"
          />
        </Box>
      </>
    );
  };

  // Course performance insights
  const CoursePerformanceInsights = () => {
    if (loading) {
      return (
        <SkeletonText mt={4} noOfLines={5} spacing="4" skeletonHeight="4" />
      );
    }

    const insights = analyticsData?.insights || [];

    return (
      <>
        {insights.length > 0 ? (
          <Box>
            {insights.map((insight, index) => (
              <Text key={index} mb={3}>
                <Text as="span" fontWeight="bold" color="blue.500">
                  {insight.title}:{" "}
                </Text>
                {insight.description}
              </Text>
            ))}
          </Box>
        ) : (
          <Text>
            No specific insights available at this time. Try selecting a
            specific course or adjusting the time range to view more detailed
            analytics.
          </Text>
        )}

        <HStack mt={6} spacing={4}>
          <Button leftIcon={<FaDownload />} colorScheme="blue" size="sm">
            Download Reports
          </Button>
          <Button leftIcon={<FaQuestionCircle />} variant="outline" size="sm">
            Analytics Help
          </Button>
        </HStack>
      </>
    );
  };

  return (
    <Container maxW="100%" py={8}>
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Instructor Analytics Dashboard
        </Heading>
        <Text color={subtleColor}>
          Track your course performance and student engagement
        </Text>
        <Divider mt={4} />
      </Box>

      {/* Filters */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={8}
        gap={3}
      >
        <HStack>
          <Text fontWeight="medium">View Analytics For:</Text>
          <Select
            width="auto"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            isDisabled={coursesLoading}
          >
            <option value="all">All Courses</option>
            {coursesData?.results?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </Select>
        </HStack>

        <HStack>
          <Text fontWeight="medium">Time Range:</Text>
          <Select
            width="auto"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </Select>
        </HStack>
      </Flex>

      {/* Loading indicator for the entire dashboard */}
      {loading && (
        <Flex justify="center" my={4}>
          <Text color={subtleColor} mr={2}>
            Loading analytics data
          </Text>
          <Spinner size="sm" color="blue.500" />
        </Flex>
      )}

      {/* Top stats overview */}
      <SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} spacing={6} mb={8}>
        <StatCard
          title="Total Students"
          value={analyticsData?.total_students}
          icon={FaUserGraduate}
          color="blue"
          description="Students enrolled in your courses"
          isLoading={loading}
        />
        <StatCard
          title="Course Completions"
          value={analyticsData?.course_completions}
          icon={FaCertificate}
          color="green"
          description="Students who finished your courses"
          isLoading={loading}
        />
        <StatCard
          title="Average Rating"
          value={
            analyticsData?.average_rating
              ? `${analyticsData.average_rating.toFixed(1)}/5`
              : "N/A"
          }
          icon={FaStar}
          color="yellow"
          description="Your courses' average rating"
          isLoading={loading}
        />
        {/* <StatCard
          title="Total Revenue"
          value={
            analyticsData?.total_revenue
              ? `$${analyticsData.total_revenue.toFixed(2)}`
              : "$0.00"
          }
          icon={FaMoneyBillWave}
          color="purple"
          description="Your course sales earnings"
          isLoading={loading}
        /> */}
      </SimpleGrid>

      {/* Tabs for different analytics views */}
      <Tabs colorScheme="blue" isLazy mb={8}>
        <TabList>
          <Tab>Student Engagement</Tab>
          <Tab>Course Performance</Tab>
          <Tab>Content Analysis</Tab>
        </TabList>

        <TabPanels>
          {/* Student Engagement Panel */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <StatCard
                title="Active Students"
                value={analyticsData?.active_students}
                icon={FaUserClock}
                color="teal"
                isLoading={loading}
              />
              <StatCard
                title="Total Watch Time"
                value={
                  analyticsData?.total_watch_time
                    ? `${analyticsData.total_watch_time} hrs`
                    : "0 hrs"
                }
                icon={FaClock}
                color="cyan"
                isLoading={loading}
              />
              <StatCard
                title="Assignments Submitted"
                value={analyticsData?.assignments_submitted}
                icon={FaCheckCircle}
                color="orange"
                isLoading={loading}
              />
            </SimpleGrid>

            <Card bg={cardBg} boxShadow="md" borderRadius="lg">
              <CardHeader>
                <Heading size="md">Engagement Metrics</Heading>
              </CardHeader>
              <CardBody>
                <StudentEngagementMetrics />
              </CardBody>
            </Card>
          </TabPanel>

          {/* Course Performance Panel */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <StatCard
                title="Total Courses"
                value={analyticsData?.total_courses}
                icon={FaBookOpen}
                color="blue"
                isLoading={loading}
              />
              <StatCard
                title="Total Reviews"
                value={analyticsData?.total_reviews}
                icon={FaComments}
                color="pink"
                isLoading={loading}
              />
              <StatCard
                title="Most Popular Course"
                value={analyticsData?.most_popular_course?.title || "N/A"}
                icon={FaChartLine}
                color="red"
                isLoading={loading}
              />
            </SimpleGrid>

            <Card bg={cardBg} boxShadow="md" borderRadius="lg">
              <CardHeader>
                <Heading size="md">Course Performance Insights</Heading>
              </CardHeader>
              <CardBody>
                <CoursePerformanceInsights />
              </CardBody>
            </Card>
          </TabPanel>

          {/* Content Analysis Panel */}
          <TabPanel>
            <Text mb={4} fontWeight="medium">
              Learn which content works best with your students and where to
              improve
            </Text>

            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height="150px" borderRadius="md" />
                ))}
              </SimpleGrid>
            ) : (
              <>
                <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={6}>
                  <CardHeader>
                    <Heading size="md">Most Engaging Content</Heading>
                  </CardHeader>
                  <CardBody>
                    {analyticsData?.engaging_content?.length > 0 ? (
                      <Box>
                        {analyticsData.engaging_content.map((content, idx) => (
                          <Flex key={idx} mb={3} align="center">
                            <Box
                              mr={4}
                              p={2}
                              borderRadius="full"
                              bg="green.100"
                            >
                              <Text fontWeight="bold" color="green.500">
                                {idx + 1}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontWeight="medium">{content.title}</Text>
                              <Text fontSize="sm" color={subtleColor}>
                                {content.type} • {content.engagement_score}%
                                engagement • {content.watch_time} avg. time
                              </Text>
                            </Box>
                          </Flex>
                        ))}
                      </Box>
                    ) : (
                      <Text>No content engagement data available yet.</Text>
                    )}
                  </CardBody>
                </Card>

                <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Content Improvement Suggestions</Heading>
                  </CardHeader>
                  <CardBody>
                    {analyticsData?.improvement_suggestions?.length > 0 ? (
                      <Box>
                        {analyticsData.improvement_suggestions.map(
                          (suggestion, idx) => (
                            <Flex key={idx} mb={4}>
                              <Box mr={3} mt={1} color="blue.500">
                                <Icon as={FaQuestionCircle} />
                              </Box>
                              <Box>
                                <Text fontWeight="medium" mb={1}>
                                  {suggestion.title}
                                </Text>
                                <Text fontSize="sm">
                                  {suggestion.description}
                                </Text>
                              </Box>
                            </Flex>
                          )
                        )}
                      </Box>
                    ) : (
                      <Text>
                        No improvement suggestions available at this time.
                      </Text>
                    )}
                  </CardBody>
                </Card>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Index;
