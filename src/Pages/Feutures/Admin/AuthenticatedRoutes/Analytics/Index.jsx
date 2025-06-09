import React from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
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
} from "@chakra-ui/react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
  FaStar,
  FaMoneyBillWave,
  FaUserCog,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { useFetch } from "../../../../../Hooks/Index";

const AnalyticsDashboard = () => {
  const {
    data: analyticsData,
    loading,
    error,
  } = useFetch({
    endpoint: "/panal/dashboard/",
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
                {value !== null ? value : "N/A"}
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
  const ProgressMetrics = () => {
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
            <Text fontWeight="medium">Student Acquisition</Text>
            <Text>{analyticsData?.total_students} / 100</Text>
          </Flex>
          <Progress
            value={analyticsData?.total_students}
            max={100}
            colorScheme="blue"
            borderRadius="full"
          />
        </Box>

        <Box mb={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Course Creation</Text>
            <Text>{analyticsData?.total_courses} / 10</Text>
          </Flex>
          <Progress
            value={analyticsData?.total_courses * 10}
            max={100}
            colorScheme="green"
            borderRadius="full"
          />
        </Box>

        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Affiliate Network</Text>
            <Text>{analyticsData?.total_afiliates} / 50</Text>
          </Flex>
          <Progress
            value={analyticsData?.total_afiliates * 2}
            max={100}
            colorScheme="purple"
            borderRadius="full"
          />
        </Box>
      </>
    );
  };

  // Loading state for status summary
  const StatusSummary = () => {
    if (loading) {
      return (
        <SkeletonText mt={4} noOfLines={3} spacing="4" skeletonHeight="4" />
      );
    }

    return (
      <>
        <Text mb={4}>
          Your platform currently has {analyticsData?.total_courses} course and{" "}
          {analyticsData?.total_students} student. No sales have been recorded
          yet. The affiliate program is ready but has no participants at this
          time.
        </Text>
        <Text fontWeight="medium" color="blue.500">
          Recommendation: Add more courses and invite instructors to expand your
          catalog.
        </Text>
      </>
    );
  };

  return (
    <Container maxW="100%" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          Analytics Dashboard
        </Heading>
        <Text color={subtleColor}>Platform performance at a glance</Text>
        <Divider mt={4} />
      </Box>

      {/* Loading indicator for the entire dashboard */}
      {loading && (
        <Flex justify="center" my={4}>
          <Text color={subtleColor} mr={2}>
            Loading dashboard data
          </Text>
          <Spinner size="sm" color="blue.500" />
        </Flex>
      )}

      {/* Top stats overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Total Students"
          value={analyticsData?.total_students}
          icon={FaUserGraduate}
          color="blue"
          description="Active learners on the platform"
          isLoading={loading}
        />
        <StatCard
          title="Total Courses"
          value={analyticsData?.total_courses}
          icon={FaBookOpen}
          color="green"
          description="Available courses for enrollment"
          isLoading={loading}
        />
        <StatCard
          title="Courses Sold"
          value={analyticsData?.courses_sold}
          icon={FaMoneyBillWave}
          color="purple"
          description="Total course purchases"
          isLoading={loading}
        />
        <StatCard
          title="Total Sales"
          value={analyticsData?.total_sales}
          icon={FaChartLine}
          color="orange"
          description="Revenue from course sales"
          isLoading={loading}
        />
      </SimpleGrid>

      {/* User metrics */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          User Metrics
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <StatCard
            title="Total Instructors"
            value={analyticsData?.total_instructors}
            icon={FaChalkboardTeacher}
            color="teal"
            isLoading={loading}
          />
          <StatCard
            title="Total Admins"
            value={analyticsData?.total_admins}
            icon={FaUserCog}
            color="red"
            isLoading={loading}
          />
          <StatCard
            title="Total Reviews"
            value={analyticsData?.total_reviews}
            icon={FaStar}
            color="yellow"
            isLoading={loading}
          />
        </SimpleGrid>
      </Box>

      {/* Affiliate statistics */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Affiliate Program
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <StatCard
            title="Total Affiliates"
            value={analyticsData?.total_afiliates}
            icon={FaUsers}
            color="cyan"
            isLoading={loading}
          />
          <StatCard
            title="Affiliate Visits"
            value={analyticsData?.total_afiliate_visits}
            icon={FaChartLine}
            color="pink"
            isLoading={loading}
          />
        </SimpleGrid>
      </Box>

      {/* Progress overview */}
      <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={8}>
        <CardHeader>
          <Heading size="md">Platform Growth Metrics</Heading>
        </CardHeader>
        <CardBody>
          <ProgressMetrics />
        </CardBody>
      </Card>

      {/* Status summary */}
      <Card bg={cardBg} boxShadow="md" borderRadius="lg">
        <CardHeader>
          <Heading size="md">Platform Status</Heading>
        </CardHeader>
        <CardBody>
          <StatusSummary />
        </CardBody>
      </Card>
    </Container>
  );
};

export default AnalyticsDashboard;
