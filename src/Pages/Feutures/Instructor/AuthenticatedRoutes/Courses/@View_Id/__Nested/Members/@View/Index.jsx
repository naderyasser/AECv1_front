import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
  Box,
  Icon,
  VStack,
  HStack,
  Tooltip,
  InputGroup,
  Input,
  InputRightElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaChevronDown,
  FaEnvelope,
  FaEye,
  FaUserGraduate,
  FaUserCheck,
  FaChartLine,
  FaMailBulk,
  FaUserPlus,
  FaCalendarCheck,
  FaClipboardCheck,
  FaClock,
} from "react-icons/fa";
import { Pagination } from "../../../../../../../../../Components/Common/Index";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import axiosInstance from "../../../../../../../../../axiosConfig/axiosInstance";

// Component to display member stats at the top
const MemberStats = ({ totalMembers, activeMembers, completionRate }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5} width="100%">
      <Stat
        p={4}
        shadow="sm"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
      >
        <StatLabel display="flex" alignItems="center">
          <Icon as={FaUserGraduate} mr={2} color="blue.500" />
          Total Students
        </StatLabel>
        <StatNumber fontSize="3xl">{totalMembers}</StatNumber>
        <StatHelpText>Enrolled in this course</StatHelpText>
      </Stat>

      <Stat
        p={4}
        shadow="sm"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
      >
        <StatLabel display="flex" alignItems="center">
          <Icon as={FaUserCheck} mr={2} color="green.500" />
          Active Students
        </StatLabel>
        <StatNumber fontSize="3xl">{activeMembers}</StatNumber>
        <StatHelpText>
          {totalMembers ? Math.round((activeMembers / totalMembers) * 100) : 0}%
          of total
        </StatHelpText>
      </Stat>

      <Stat
        p={4}
        shadow="sm"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
      >
        <StatLabel display="flex" alignItems="center">
          <Icon as={FaChartLine} mr={2} color="purple.500" />
          Completion Rate
        </StatLabel>
        <StatNumber fontSize="3xl">{completionRate || 0}%</StatNumber>
        <StatHelpText>Average course completion</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
};

// Enhanced MemberCard component with more features
const MemberCard = ({ member, onSendEmail }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days since joined
  const daysSinceJoined = () => {
    const joinDate = new Date(member.created_at);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card
      p={4}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      width="100%"
      maxW="340px"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
      bg="white"
    >
      <Flex direction="column" align="center" gap={3}>
        <Avatar size="xl" name={member.name} src={member.profile_pic} mb={2} />
        <Heading size="md">{member.name}</Heading>
        <Text color="gray.500" fontSize="sm">
          {member.email}
        </Text>

        <Flex wrap="wrap" gap={2} justify="center">
          <Badge
            colorScheme={
              member.role === "admin"
                ? "red"
                : member.is_instructor
                ? "purple"
                : "blue"
            }
          >
            {member.role === "admin"
              ? "Admin"
              : member.is_instructor
              ? "Instructor"
              : "Student"}
          </Badge>
          <Badge colorScheme={member.is_active ? "green" : "gray"}>
            {member.is_active ? "Active" : "Inactive"}
          </Badge>
        </Flex>

        <VStack spacing={1} w="100%" align="flex-start" mt={2}>
          <HStack>
            <Icon as={FaCalendarCheck} color="gray.500" />
            <Text fontSize="sm">Joined: {formatDate(member.created_at)}</Text>
          </HStack>

          <HStack>
            <Icon as={FaClock} color="gray.500" />
            <Text fontSize="sm">{daysSinceJoined()} days in course</Text>
          </HStack>

          {member.progress && (
            <HStack>
              <Icon as={FaClipboardCheck} color="gray.500" />
              <Text fontSize="sm">Progress: {member.progress}%</Text>
            </HStack>
          )}
        </VStack>

        <Divider my={2} />

        <HStack spacing={2} w="100%" justify="center">
          <Tooltip label="View Student Profile">
            <Button
              size="sm"
              leftIcon={<FaEye />}
              variant="outline"
              onClick={() => {
                // Navigate to student profile or details page if available
                toast({
                  title: "Feature in development",
                  description: "Student profiles coming soon",
                  status: "info",
                });
              }}
            >
              Profile
            </Button>
          </Tooltip>

          <Tooltip label="Contact Student">
            <Button
              size="sm"
              leftIcon={<FaEnvelope />}
              colorScheme="blue"
              variant="outline"
              onClick={() => onSendEmail(member)}
            >
              Contact
            </Button>
          </Tooltip>
        </HStack>
      </Flex>
    </Card>
  );
};

// Email modal component
const EmailModal = ({ isOpen, onClose, student, onSend }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens with a new student
  useEffect(() => {
    if (isOpen) {
      setSubject("");
      setMessage("");
    }
  }, [isOpen, student]);

  const handleSend = async () => {
    if (!subject || !message) {
      return;
    }

    setIsLoading(true);
    try {
      await onSend({
        studentId: student?.id,
        studentEmail: student?.email,
        subject,
        message,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact {student?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Box w="100%">
              <Text mb={2} fontWeight="medium">
                To:
              </Text>
              <Input value={student?.email || ""} isReadOnly bg="gray.50" />
            </Box>

            <Box w="100%">
              <Text mb={2} fontWeight="medium">
                Subject:
              </Text>
              <Input
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Box>

            <Box w="100%">
              <Text mb={2} fontWeight="medium">
                Message:
              </Text>
              <Input
                as="textarea"
                placeholder="Type your message here..."
                rows={6}
                h="150px"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<FaEnvelope />}
            onClick={handleSend}
            isLoading={isLoading}
            isDisabled={!subject || !message}
          >
            Send Email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const { user } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  // For email modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch members data with pagination and filters
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/courses/${id}/members/`,
    params: {
      page,
      search: searchTerm || undefined,
      filter: filterOption !== "all" ? filterOption : undefined,
      sort: sortOption || undefined,
    },
  });

  // Handler for searching
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1); // Reset to first page when searching
    }
  };

  // Handler for sending email to a student
  const handleSendEmail = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  // Function to actually send the email
  const sendEmail = async (emailData) => {
    try {
      // Implement the API call to send email
      // This is a placeholder - replace with your actual API endpoint
      await axiosInstance.post(
        "/communication/send-email/",
        {
          course_id: id,
          recipient_id: emailData.studentId,
          subject: emailData.subject,
          message: emailData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${
              user.data.token.access || user.data.token
            }`,
          },
        }
      );

      toast({
        title: "Email sent successfully",
        status: "success",
      });

      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      toast({
        title: "Failed to send email",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
      });
      return false;
    }
  };

  // Calculate member statistics
  const totalMembers = data?.pagination?.total || 0;
  const activeMembers =
    data?.results?.filter((member) => member.is_active)?.length || 0;
  const completionRate = data?.course_stats?.completion_rate || 0;

  // Filtered and sorted members
  const filteredMembers = data?.results || [];

  return (
    <Stack gap="3" p="5" w="100%" h="100%">
      {/* Stats Section */}
      <Box mb={4}>
        <MemberStats
          totalMembers={totalMembers}
          activeMembers={activeMembers}
          completionRate={completionRate}
        />
      </Box>

      {/* Header and Search Section */}
      <Flex
        wrap="wrap"
        p={{ base: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        gap="5"
        bg="white"
        borderRadius="md"
        shadow="sm"
        mb={4}
      >
        <Heading size="md">Course Students</Heading>

        <Flex gap="3" flexWrap="wrap">
          <InputGroup size="md" width={{ base: "100%", md: "auto" }}>
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <InputRightElement>
              <Icon as={FaSearch} color="gray.500" />
            </InputRightElement>
          </InputGroup>

          <Select
            width={{ base: "100%", md: "auto" }}
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
              setPage(1); // Reset to first page when filtering
            }}
            placeholder="Filter by status"
            icon={<FaFilter />}
          >
            <option value="all">All Students</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="new">New Students</option>
            <option value="completed">Completed Course</option>
          </Select>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              leftIcon={<FaSortAmountDown />}
              variant="outline"
            >
              Sort
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSortOption("newest")}>
                Newest First
              </MenuItem>
              <MenuItem onClick={() => setSortOption("oldest")}>
                Oldest First
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => setSortOption("name_asc")}>
                Name (A-Z)
              </MenuItem>
              <MenuItem onClick={() => setSortOption("name_desc")}>
                Name (Z-A)
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => setSortOption("progress_high")}>
                Highest Progress
              </MenuItem>
              <MenuItem onClick={() => setSortOption("progress_low")}>
                Lowest Progress
              </MenuItem>
            </MenuList>
          </Menu>

          <Button
            leftIcon={<FaMailBulk />}
            colorScheme="blue"
            isLoading={isSendingBulkEmail}
            onClick={() => {
              toast({
                title: "Feature in development",
                description: "Bulk email functionality coming soon",
                status: "info",
              });
            }}
          >
            Bulk Email
          </Button>
        </Flex>
      </Flex>

      <Divider />

      {/* Members List */}
      {loading ? (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={5}
          minH="500px"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height="300px" borderRadius="md" />
          ))}
        </SimpleGrid>
      ) : filteredMembers.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={5}
          minH="500px"
        >
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onSendEmail={() => handleSendEmail(member)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="500px"
          bg="gray.50"
          borderRadius="md"
          p={10}
        >
          <Icon as={FaUserGraduate} boxSize={16} color="gray.400" mb={4} />
          <Heading size="md" mb={2} textAlign="center">
            No students found
          </Heading>
          <Text color="gray.500" textAlign="center" maxW="500px">
            {searchTerm
              ? "No students match your search criteria. Try adjusting your filters."
              : "This course doesn't have any students enrolled yet."}
          </Text>
          {!searchTerm && (
            <Button
              mt={6}
              colorScheme="blue"
              leftIcon={<FaUserPlus />}
              onClick={() => {
                toast({
                  title: "Feature in development",
                  description: "Student invitation functionality coming soon",
                  status: "info",
                });
              }}
            >
              Invite Students
            </Button>
          )}
        </Flex>
      )}

      {/* Pagination */}
      {!loading && filteredMembers.length > 0 && (
        <Pagination
          isLoading={loading}
          totalPages={data?.pagination?.totalPages}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
        />
      )}

      {/* Email Modal */}
      <EmailModal
        isOpen={isOpen}
        onClose={onClose}
        student={selectedStudent}
        onSend={sendEmail}
      />
    </Stack>
  );
};

export default Index;
