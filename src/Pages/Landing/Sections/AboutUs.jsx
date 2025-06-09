import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  VStack,
  Icon,
  Card,
  CardBody,
  Button,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdSchool,
  MdSupportAgent,
  MdLaptop,
  MdAssignment,
  MdOutlineAnalytics,
  MdPeople,
  MdPerson,
  MdSecurity,
} from "react-icons/md";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { BsPersonWorkspace } from "react-icons/bs";
import { CenteredTextWithLines } from "../../../Components/Common/Index";
import { Link } from "react-router-dom";

// Service Card Component
const ServiceCard = ({ icon, title, description }) => (
  <Card
    direction="column"
    variant="elevated"
    overflow="hidden"
    boxShadow="md"
    borderRadius="lg"
    transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
  >
    <CardBody>
      <Flex direction="column" align="center" textAlign="center">
        <Icon as={icon} boxSize={12} color="blue.500" mb={4} />
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600">{description}</Text>
      </Flex>
    </CardBody>
  </Card>
);

ServiceCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// User Type Card Component
const UserTypeCard = ({ icon, title }) => (
  <Card
    bg="white"
    p={6}
    borderRadius="lg"
    boxShadow="md"
    textAlign="center"
    maxW="250px"
    mx="auto"
    transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
  >
    <Flex direction="column" align="center">
      <Icon as={icon} boxSize={14} color="blue.500" mb={4} />
      <Heading size="md">{title}</Heading>
    </Flex>
  </Card>
);

UserTypeCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

// Platform Feature Card
const PlatformFeatureCard = ({ icon, title }) => (
  <Flex
    bg="blue.50"
    p={4}
    borderRadius="md"
    align="center"
    boxShadow="sm"
    transition="all 0.3s"
    _hover={{ bg: "blue.100", transform: "translateY(-2px)" }}
  >
    {icon && <Icon as={icon} boxSize={6} color="blue.500" mr={3} />}
    <Text fontWeight="medium">{title}</Text>
  </Flex>
);

PlatformFeatureCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
};

export default function AboutUs() {
  return (
    <Box py={16}>
      <Container maxW="container.xl">
        {/* About AEC Section */}
        <VStack spacing={12} align="stretch">
          <VStack spacing={6} align="center" textAlign="center">
            <CenteredTextWithLines
              w="100%"
              maxW="80%"
              transition="0.5s"
              dividerColor="gray.700"
            >
              {" "}
              <Heading flexShrink="0" size="xl" as="h1" color="blue.600">
                About AEC Platform
              </Heading>
            </CenteredTextWithLines>
            <Text fontSize="lg" maxW="2xl" mx="auto" color="gray.600">
              An educational platform that connects students and teachers in
              various disciplines from all over the world
            </Text>
          </VStack>
          {/* Platform Description */}
          <Box>
            <Heading size="lg" mb={4} textAlign="center">
              What Does AEC Platform Offer?
            </Heading>
            <Text textAlign="center" maxW="3xl" mx="auto" mb={8}>
              The Advanced Education Academy (AEC) platform offers a wide range
              of services, training courses, and diplomas in various fields,
              including medicine, engineering, management, accounting,
              economics, statistics, law, marketing, graphic design,
              programming, networking, languages, personal care and fitness,
              tourism and hotels, human development, creative arts and design,
              and other sciences that help students seize job opportunities.
            </Text>
          </Box>{" "}
          {/* Services Section */}
          <Box>
            {" "}
            <Heading size="lg" mb={6} textAlign="center">
              Services Provided by the Platform
            </Heading>
            <Text textAlign="center" mb={8}>
              We provide a flexible range of high-quality services to help
              develop individuals and institutions, including but not limited
              to:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {" "}
              <ServiceCard
                icon={GiSecretBook}
                title="Training Courses & Diplomas"
                description="Offering a variety of training courses and diverse diplomas"
              />
              <ServiceCard
                icon={MdSupportAgent}
                title="Instant Consultation Service"
                description="Providing instant consultation services in various fields"
              />
              <ServiceCard
                icon={MdSchool}
                title="Lessons & Follow-up"
                description="Explaining and following up on lessons for university students and beyond"
              />
              <ServiceCard
                icon={FaGraduationCap}
                title="Graduation Project Assistance"
                description="Providing assistance with graduation projects"
              />
              <ServiceCard
                icon={MdLaptop}
                title="Scientific Research"
                description="Assistance in creating scientific research and publishing in renowned global journals"
              />
              <ServiceCard
                icon={MdAssignment}
                title="Exam Preparation"
                description="Help in preparing for exams and solving assignments"
              />
            </SimpleGrid>
          </Box>{" "}
          {/* Platform Goals Section */}
          <Box>
            {" "}
            <Heading size="lg" mb={6} textAlign="center">
              Platform Objectives
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack
                align="start"
                spacing={4}
                p={5}
                bg="blue.50"
                borderRadius="md"
              >
                <Heading size="md">Distinctive Scientific Content</Heading>
                <Text>
                  Providing free and paid scientific content of high quality
                  across various fields
                </Text>
              </VStack>
              <VStack
                align="start"
                spacing={4}
                p={5}
                bg="blue.50"
                borderRadius="md"
              >
                <Heading size="md">
                  Individual & Institutional Development
                </Heading>
                <Text>
                  Offering flexible, high-quality services to assist in
                  developing individuals and organizations
                </Text>
              </VStack>
            </SimpleGrid>
            <Box mt={8}>
              {" "}
              <Text fontWeight="medium" fontSize="lg">
                Our services include:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={4}>
                {" "}
                <Text>• Providing various training courses and diplomas</Text>
                <Text>• Instant consultation services in various fields</Text>
                <Text>
                  • Lesson explanation and follow-up for university students
                </Text>
                <Text>• Assistance with graduation projects</Text>
                <Text>
                  • Help creating scientific research and publishing in renowned
                  journals
                </Text>
                <Text>• Assistance in exam preparation</Text>
                <Text>• Help with solving assignments</Text>
              </SimpleGrid>
            </Box>
          </Box>
          {/* Users Section */}
          <Box>
            {" "}
            <Heading size="lg" mb={6} textAlign="center">
              Platform Users
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <UserTypeCard icon={FaChalkboardTeacher} title="Teachers" />
              <UserTypeCard icon={MdPerson} title="Students" />
              <UserTypeCard icon={MdPeople} title="Administration" />
            </SimpleGrid>
          </Box>{" "}
          {/* Platform Features */}
          <Box>
            {" "}
            <Heading size="lg" mb={6} textAlign="center">
              Platform Specifications & Features
            </Heading>
            <Text textAlign="center" mb={6}>
              Compatible with web development standards and all browsers, usable
              on all mobile devices
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {" "}
              <PlatformFeatureCard
                icon={MdLaptop}
                title="Compatible with all browsers"
              />
              <PlatformFeatureCard
                icon={BsPersonWorkspace}
                title="Unique platform interface design"
              />
              <PlatformFeatureCard
                icon={MdSecurity}
                title="System security & privacy guarantee"
              />
              <PlatformFeatureCard
                icon={MdOutlineAnalytics}
                title="Precise financial system"
              />
              <PlatformFeatureCard
                icon={MdPeople}
                title="Effective communication system"
              />
              <PlatformFeatureCard
                icon={MdAssignment}
                title="Integrated assignment system"
              />
            </SimpleGrid>
            <Box mt={8}>
              {" "}
              <Heading size="md" mb={4}>
                Integrated Platforms:
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {" "}
                <PlatformFeatureCard title="Blog" />
                <PlatformFeatureCard title="Employment System" />
                <PlatformFeatureCard title="Archive System" />
                <PlatformFeatureCard title="Examination System" />
                <PlatformFeatureCard title="Certificates System" />
                <PlatformFeatureCard title="Courses System" />
                <PlatformFeatureCard title="Educational Curriculum System" />
                <PlatformFeatureCard title="Messaging System" />
                <PlatformFeatureCard title="Assignment System" />
                <PlatformFeatureCard title="Live Broadcast System" />
                <PlatformFeatureCard title="Educational Video System" />
                <PlatformFeatureCard title="Integrated Payment Methods" />
              </SimpleGrid>
            </Box>
            <Box mt={8}>
              {" "}
              <Heading size="md" mb={4}>
                User Permissions:
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <UserTypeCard icon={MdPeople} title="Admins" />
                <UserTypeCard icon={MdPerson} title="Students" />
                <UserTypeCard
                  icon={FaChalkboardTeacher}
                  title="Teaching Staff"
                />
                <UserTypeCard
                  icon={BsPersonWorkspace}
                  title="Offices/Companies"
                />
              </SimpleGrid>
            </Box>
            <Box mt={8}>
              {" "}
              <Heading size="md" mb={4}>
                Technical Specifications:
              </Heading>
              <VStack align="start" spacing={2}>
                <Text>
                  • Programming languages: PHP Laravel – HTML5, CSS3, jQuery –
                  MySQL
                </Text>
                <Text>
                  • Support and maintenance (technical, administrative, quality
                  control for one calendar year)
                </Text>
                <Text>• Website connection with domain</Text>
                <Text>• System security and privacy assurance</Text>
                <Text>
                  • Precise financial system ensuring payment security
                </Text>
                <Text>• Integration with all social media accounts</Text>
                <Text>
                  • Tracking and recording system for all platform activities
                </Text>
                <Text>• System for recording and archiving lectures</Text>
                <Text>• Employment, opportunities, and offers page</Text>
                <Text>• Issue management system</Text>
                <Text>• Official academy email linked to the website</Text>
              </VStack>
            </Box>
          </Box>{" "}
          {/* Registration Section */}
          <Box mt={12}>
            <Heading size="lg" mb={6} textAlign="center">
              User Registration
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* Teacher Registration */}
              <Box
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <Heading size="md" mb={4} color="blue.600">
                  <Flex align="center">
                    <Icon as={FaChalkboardTeacher} mr={2} />
                    Teacher Registration
                  </Flex>
                </Heading>
                <Text mb={4}>
                  Teacher registration includes the following information:
                </Text>
                <VStack align="start" spacing={2}>
                  <Text>
                    • Personal information (name, country, city, nationality,
                    age, marital status)
                  </Text>
                  <Text>• Years of teaching experience</Text>
                  <Text>• Profile picture and contact information</Text>
                  <Text>• Agreement to terms and conditions</Text>{" "}
                  <Text>
                    • Creating identification card containing (profile photo,
                    name, membership number, expiry date, specialization)
                  </Text>
                  <Text>• Introductory video and sample teaching video</Text>
                  <Text>• Subjects that the teacher teaches</Text>
                  <Text>• Upload CV and experience certificates</Text>
                </VStack>
                <Text mt={4} fontStyle="italic">
                  Students can view the teacher&apos;s profile with contact
                  information hidden.
                </Text>
              </Box>

              {/* Student Registration */}
              <Box
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <Heading size="md" mb={4} color="blue.600">
                  <Flex align="center">
                    <Icon as={MdPerson} mr={2} />
                    Student Registration
                  </Flex>
                </Heading>
                <Text mb={4}>
                  Student registration includes the following information:
                </Text>
                <VStack align="start" spacing={2}>
                  <Text>
                    • Basic student information (name, city, phone,
                    specialization)
                  </Text>
                  <Text>
                    • Creating identification card containing (profile photo,
                    name, membership number, expiry date, specialization)
                  </Text>
                  <Text>
                    • Choose desired service (tutoring, specific course,
                    assignment help, etc.)
                  </Text>
                  <Text>• Browse teachers by service and specialization</Text>
                  <Text>• Select desired teacher</Text>
                  <Text>• Choose online or in-person tutoring</Text>
                  <Text>• Ability to upload files</Text>
                  <Text>• Specify desired number of hours</Text>
                  <Text>• Generate invoice with all details</Text>
                </VStack>
                <Text mt={4} fontStyle="italic">
                  At the end of the educational journey, both teacher and
                  student evaluate the service provided.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>{" "}
          {/* Additional Features Section */}
          <Box mt={12}>
            <Heading size="lg" mb={6} textAlign="center">
              Additional Features
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box p={5} bg="blue.50" borderRadius="md">
                <Heading size="md" mb={3}>
                  Video Call Feature
                </Heading>
                <Text>
                  Providing video call functionality for conducting lectures
                  with audio and video between student and teacher, always
                  recorded.
                </Text>
              </Box>

              <Box p={5} bg="blue.50" borderRadius="md">
                <Heading size="md" mb={3}>
                  Dynamic Pages
                </Heading>
                <Text>
                  Ability to add dynamic pages and sections to the website, free
                  and paid courses, and other pages as needed.
                </Text>
              </Box>

              <Box p={5} bg="blue.50" borderRadius="md">
                <Heading size="md" mb={3}>
                  Payment Gateways
                </Heading>
                <Text>
                  Support for multiple payment methods (Western Union, local
                  transfers, credit cards, PayPal, and others).
                </Text>
              </Box>

              <Box p={5} bg="blue.50" borderRadius="md">
                <Heading size="md" mb={3}>
                  Integrated Control Panel
                </Heading>
                <Text>
                  Complete platform control panel for adding, deleting, editing,
                  student monitoring, payment processing, communication, and
                  report printing.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>{" "}
          {/* Statistics Section */}
          <Box mt={12} textAlign="center">
            <Heading size="lg" mb={6}>
              Platform Statistics
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <VStack>
                <Heading color="blue.500">1000+</Heading>
                <Text>Registered Students</Text>
              </VStack>
              <VStack>
                <Heading color="blue.500">100+</Heading>
                <Text>Specialized Teachers</Text>
              </VStack>
              <VStack>
                <Heading color="blue.500">50+</Heading>
                <Text>Training Courses</Text>
              </VStack>
              <VStack>
                <Heading color="blue.500">20+</Heading>
                <Text>Different Specializations</Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>{" "}
        {/* Call to Action Section */}
        <Box mt={16} textAlign="center">
          <Heading size="lg" mb={6}>
            Join AEC Platform Today
          </Heading>
          <Text fontSize="lg" maxW="2xl" mx="auto" mb={8}>
            The Advanced Education Academy (AEC) platform opens its doors to
            students and teachers from around the world. Discover unlimited
            learning and teaching opportunities with us.
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            maxW="container.md"
            mx="auto"
          >
            <Box>
              <Button
                as={Link}
                to="/courses"
                colorScheme="blue"
                size="lg"
                width="full"
                boxShadow="md"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
              >
                Explore Courses
              </Button>
            </Box>
            <Box>
              <Button
                as={Link}
                to="/register"
                colorScheme="green"
                size="lg"
                width="full"
                boxShadow="md"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
              >
                Register as Student
              </Button>
            </Box>
            <Box>
              <Button
                variant="outline"
                colorScheme="blue"
                size="lg"
                width="full"
                boxShadow="md"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
                onClick={() => {
                  // This would normally call handleInstructorNavigation but we'll use a simple link for now
                  window.location.href = "/instructor/register";
                }}
              >
                Join as Teacher
              </Button>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
