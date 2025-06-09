import React from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Select,
  Flex,
  Text,
  useToken,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import {
  BiBook,
  BiTime,
  BiCheck,
  BiX,
  BiCog,
  BiBookReader,
} from "react-icons/bi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const StatCard = ({ icon: Icon, title, value, bgColor }) => (
  <Box
    bg="white"
    p={6}
    borderRadius="lg"
    boxShadow="sm"
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      left={-4}
      top={-4}
      bg={bgColor}
      w="100px"
      h="100px"
      opacity={0.1}
      borderRadius="full"
    />
    <Box bg={bgColor} p={3} borderRadius="lg" display="inline-flex" mb={3}>
      <Icon size={24} color={useToken("colors", "white")} />
    </Box>
    <Text color="gray.600" mb={1} fontSize="sm">
      {title}
    </Text>
    <Text fontSize="2xl" fontWeight="bold">
      {value}
    </Text>
  </Box>
);

const TimeSpentChart = ({ data }) => (
  <Box overflow="hidden" bg="white" p={6} borderRadius="lg" boxShadow="sm">
    <Heading size="md" mb={6}>
      Time spent
    </Heading>
    <Select w="200px" mb={4} defaultValue="this-week">
      <option value="this-week">This week</option>
      <option value="last-week">Last week</option>
      <option value="last-month">Last month</option>
    </Select>
    <Box p="4" overflowX="auto">
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="class" fill="#9F7AEA" />
        <Bar dataKey="study" fill="#F687B3" />
      </BarChart>
    </Box>
  </Box>
);

const PerformanceCard = () => (
  <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
    <Heading size="md" mb={6}>
      Performance
    </Heading>
    <Flex direction="column" align="center">
      <Box position="relative" w="200px" h="200px">
        <CircularProgress
          value={80}
          size="200px"
          thickness="8px"
          color="green.400"
        >
          <CircularProgressLabel fontSize="3xl" fontWeight="bold">
            80%
          </CircularProgressLabel>
        </CircularProgress>
      </Box>
      <Text mt={4} fontSize="lg" fontWeight="medium" textAlign="center">
        You did a great job!
      </Text>
    </Flex>
  </Box>
);

export default function Index() {
  const timeSpentData = [
    { name: "Mon", class: 22, study: 0 },
    { name: "Tue", class: 0, study: 25 },
    { name: "Wed", class: 22, study: 0 },
    { name: "Thu", class: 0, study: 10 },
    { name: "Fri", class: 18, study: 0 },
    { name: "Sun", class: 0, study: 15 },
    { name: "Sat", class: 8, study: 0 },
  ];

  const stats = [
    {
      icon: BiBook,
      title: "Enrolled courses",
      value: "1,200",
      bgColor: "cyan.400",
    },
    {
      icon: BiTime,
      title: "In progress courses",
      value: "500",
      bgColor: "purple.400",
    },
    {
      icon: BiBookReader,
      title: "Finished courses",
      value: "700",
      bgColor: "blue.400",
    },
    {
      icon: BiX,
      title: "Fail courses",
      value: "4",
      bgColor: "red.400",
    },
    {
      icon: BiCheck,
      title: "Pass courses",
      value: "17",
      bgColor: "green.400",
    },
    {
      icon: BiCog,
      title: "Total quizzes",
      value: "$230.0",
      bgColor: "yellow.400",
    },
  ];

  return (
    <Container maxW="container.xl">
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading size="lg">Dashboard</Heading>
        <Select w={{ base: "full", md: "200px" }} defaultValue="this-week">
          <option value="this-week">This week</option>
          <option value="last-week">Last week</option>
          <option value="last-month">Last month</option>
        </Select>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
        mb={8}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Grid>

      <Grid w="100%" templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={6}>
        <TimeSpentChart data={timeSpentData} />
        <PerformanceCard />
      </Grid>
    </Container>
  );
}
