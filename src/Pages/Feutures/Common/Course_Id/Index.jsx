import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Avatar,
  Card,
  CardBody,
  SimpleGrid,
  Skeleton,
  Tag,
  Divider,
  Link,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import {
  CheckIcon,
  TimeIcon,
  StarIcon,
  CalendarIcon,
  InfoIcon,
  DownloadIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import { FaRegFilePdf } from "react-icons/fa6";
import { CourseCard, Pagination } from "../../../../Components/Common/Index";
import { useFetch } from "../../../../Hooks/Index";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import paytabsAxios from "../../../../axiosConfig/paytabsAxios";

// Helper function to calculate total duration from sections
const calculateTotalDuration = (sections) => {
  let totalSeconds = 0;

  sections?.forEach((section) => {
    section.lessons?.forEach((lesson) => {
      if (lesson.length) {
        const [hours, minutes, seconds] = lesson.length.split(":").map(Number);
        totalSeconds += hours * 3600 + minutes * 60 + seconds;
      }
    });
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
};

// Helper function to count total lessons
const countTotalLessons = (sections) => {
  return (
    sections?.reduce(
      (sum, section) => sum + (section.lessons?.length || 0),
      0
    ) || 0
  );
};

const CourseHeader = ({
  title,
  instructor,
  instructorImage,
  rating,
  students,
  price,
  originalPrice,
  level,
  language,
  createdAt,
  image,
  id,
  isOwned,
}) => {
  // Map language codes to names
  const languageMap = {
    ar: "Arabic",
    en: "English",
    fr: "French",
    es: "Spanish",
    // Add more languages as needed
  };

  // Map level to color scheme
  const levelColorMap = {
    beginner: "green",
    intermediate: "blue",
    advanced: "red",
  };

  // Calculate discount percentage if originalPrice exists
  const discountPercentage =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "SA", // Default to Saudi Arabia
    zip: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  // Handle payment form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to process payment through PayTabs
  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Create the payment payload
      const paymentPayload = {
        cart_id: `ORDER_${Date.now()}`,
        user_id: JSON.parse(localStorage.getItem("User"))?.id || "",
        course_id: id,
        currency: "SAR",
        amount: price.toString(),
        description: `Payment for course: ${title}`,
        ...paymentData,
      };

      const response = await paytabsAxios.post(
        "/paytabs/make-payment/",
        paymentPayload
      );

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        toast({
          title: "Payment initiated",
          description: "Please complete your payment",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description:
          error.response?.data?.message ||
          "There was an error processing your payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
        <Box>
          <Image
            src={image || "https://placehold.co/600x400"}
            alt={`${title} banner`}
            borderRadius="lg"
            w="100%"
            objectFit="cover"
          />
        </Box>
        <Box>
          <VStack
            align="start"
            spacing={4}
            w="full"
            h="full"
            justifyContent="space-between"
          >
            <Box
              w="full"
              h="full"
              display={"flex"}
              flexDirection={"column"}
              gap={4}
            >
              <Badge
                colorScheme={levelColorMap[level] || "purple"}
                alignSelf="flex-start"
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Badge>
              <Heading size="lg">{title}</Heading>
              <HStack>
                <Avatar size="sm" name={instructor} src={instructorImage} />
                <Text>{instructor}</Text>
              </HStack>
              <HStack>
                <StarIcon color="yellow.400" />
                <Text>{rating || "No ratings yet"}</Text>
                <Text>
                  ({students} student{students !== 1 ? "s" : ""})
                </Text>
              </HStack>
              <HStack>
                <InfoIcon />
                <Text>Language: {languageMap[language] || language}</Text>
                <Box ml={2}>
                  <CalendarIcon mr={1} />
                  <Text display="inline">
                    Created: {format(new Date(createdAt), "MMM d, yyyy")}
                  </Text>
                </Box>
              </HStack>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {price} SAR{" "}
                  {discountPercentage && (
                    <>
                      <Text
                        as="span"
                        textDecoration="line-through"
                        color="gray.500"
                        fontSize="md"
                      >
                        {originalPrice} SAR
                      </Text>
                      <Badge colorScheme="green" ml={2}>
                        {discountPercentage}% off
                      </Badge>
                    </>
                  )}
                </Text>
              </Box>
            </Box>
            <Box w="full">
              {isOwned ? (
                <Button
                  colorScheme="green"
                  size="lg"
                  width={"full"}
                  as={"a"}
                  href={`/student/watch-course/${id}`}
                >
                  Go to Course
                </Button>
              ) : (
                <Box
                  w="full"
                  display="flex"
                  justifyContent="space-between"
                  gap={4}
                  alignItems={"start"}
                  flexDirection={"column"}
                >
                  <Button colorScheme="blue" size="lg" w={"full"}>
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    w={"full"}
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    Buy Now
                  </Button>
                  <HStack w={"full"}>
                    <Input placeholder="Enter Coupon" />
                    <Button>Apply</Button>
                  </HStack>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </Grid>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout - {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Please provide your payment information to purchase this course
              for <strong>{price} SAR</strong>
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={paymentData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={paymentData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone"
                  value={paymentData.phone}
                  onChange={handleInputChange}
                  placeholder="Saudi mobile number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Street Address</FormLabel>
                <Input
                  name="street"
                  value={paymentData.street}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  value={paymentData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>State/Province</FormLabel>
                <Input
                  name="state"
                  value={paymentData.state}
                  onChange={handleInputChange}
                  placeholder="Enter province/region"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Select
                  name="country"
                  value={paymentData.country}
                  onChange={handleInputChange}
                >
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="EG">Egypt</option>
                  <option value="JO">Jordan</option>
                  <option value="KW">Kuwait</option>
                  <option value="QA">Qatar</option>
                  <option value="BH">Bahrain</option>
                  <option value="OM">Oman</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ZIP/Postal Code</FormLabel>
                <Input
                  name="zip"
                  value={paymentData.zip}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handlePayment}
              isLoading={isProcessing}
              loadingText="Processing"
            >
              Proceed to Payment
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Course Attachments Component
const CourseAttachments = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        Course Resources
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {attachments.map((attachment) => (
          <HStack
            key={attachment.id}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            spacing={3}
          >
            <Icon as={FaRegFilePdf} color="red.500" boxSize={5} />
            <Text flex="1" isTruncated>
              {attachment.url.split("/").pop()}
            </Text>
            <Link href={attachment.url} isExternal>
              <Button size="sm" leftIcon={<DownloadIcon />} colorScheme="blue">
                Download
              </Button>
            </Link>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

const CourseDescription = ({ description }) => (
  <Box mb={8}>
    <Heading size="md" mb={4}>
      About this course
    </Heading>
    <Text>{description}</Text>
  </Box>
);

const LearningPoints = () => (
  <Box mb={8}>
    <Heading size="md" mb={4}>
      What you'll learn
    </Heading>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {[
        "Logo Design Theory",
        "The power of color Psychology in Logo Design",
        "Learn what questions to ask before starting your design process",
        "How to use the Golden Ratio in Logo Design",
        "How to present your logo in a professional polished way",
        "Understand the full creative and brainstorming process",
      ].map((point, index) => (
        <HStack key={index} align="flex-start">
          <CheckIcon color="green.500" mt={1} />
          <Text>{point}</Text>
        </HStack>
      ))}
    </SimpleGrid>
  </Box>
);

const CourseIncludes = () => (
  <Box mb={8}>
    <Heading size="md" mb={4}>
      This course includes:
    </Heading>
    <List spacing={3}>
      <ListItem>
        <ListIcon as={CheckIcon} color="green.500" />
        9.5 hours on-demand video
      </ListItem>
      <ListItem>
        <ListIcon as={CheckIcon} color="green.500" />
        Assignments
      </ListItem>
      <ListItem>
        <ListIcon as={CheckIcon} color="green.500" />
        Certificate of completion
      </ListItem>
    </List>
  </Box>
);

const CourseContent = ({ sections = [] }) => {
  // Calculate total lessons
  const totalLessons = countTotalLessons(sections);

  // Calculate total duration from all lessons
  const totalDuration = calculateTotalDuration(sections);

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        Course Content
      </Heading>
      <Text mb={4}>
        {sections.length} Sections • {totalLessons} lessons • {totalDuration}{" "}
        total length
      </Text>

      {sections.length > 0 ? (
        <Accordion allowMultiple defaultIndex={[0]}>
          {sections.map((section, index) => {
            // Calculate section duration
            const sectionDuration = section.lessons?.reduce((total, lesson) => {
              if (lesson.length) {
                const [hours, minutes, seconds] = lesson.length
                  .split(":")
                  .map(Number);
                return total + hours * 3600 + minutes * 60 + seconds;
              }
              return total;
            }, 0);

            // Format section duration - Fix the issue here
            // For values under 3600 seconds, hours will be 0
            const sectionHours = Math.floor(sectionDuration / 3600);
            const sectionMinutes = Math.floor((sectionDuration % 3600) / 60);
            const sectionSeconds = sectionDuration % 60;

            // Format the duration string correctly
            let formattedSectionDuration = "";
            if (sectionHours > 0) {
              formattedSectionDuration += `${sectionHours}h `;
            }
            if (sectionMinutes > 0 || sectionHours > 0) {
              formattedSectionDuration += `${sectionMinutes}m`;
            } else {
              formattedSectionDuration = `${sectionSeconds}s`;
            }

            return (
              <AccordionItem key={section.id || index}>
                <AccordionButton py={3}>
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    {section.title}
                  </Box>
                  <Text mr={4}>
                    {section.lessons?.length || 0} lectures •{" "}
                    {formattedSectionDuration}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} bg="gray.50">
                  {section.lessons && section.lessons.length > 0 ? (
                    <VStack align="stretch" spacing={2} divider={<Divider />}>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <HStack
                          key={lesson.id || lessonIndex}
                          justify="space-between"
                          p={2}
                        >
                          <HStack>
                            <TimeIcon color="blue.500" />
                            <Text>{lesson.title}</Text>
                            {lesson.lesson_attachment?.length > 0 && (
                              <Badge ml={2} colorScheme="purple">
                                <HStack spacing={1}>
                                  <AttachmentIcon />
                                  <Text>{lesson.lesson_attachment.length}</Text>
                                </HStack>
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {lesson.length}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <Box p={3}>
                      <Text color="gray.500">
                        No lessons available in this section yet
                      </Text>
                    </Box>
                  )}
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <Box p={6} borderRadius="md" bg="gray.50" textAlign="center">
          <Text color="gray.500">Course content is being prepared</Text>
        </Box>
      )}
    </Box>
  );
};

const Reviews = ({ averageRating }) => (
  <Box mb={8}>
    <Heading size="md" mb={4}>
      Reviews
    </Heading>
    {averageRating > 0 ? (
      <Card>
        <CardBody>
          <HStack spacing={4} mb={4}>
            <Avatar name="William Samy" />
            <Box>
              <Text fontWeight="bold">William Samy</Text>
              <HStack>
                <StarIcon color="yellow.400" />
                <Text>4.5</Text>
              </HStack>
            </Box>
          </HStack>
          <Text>
            Reprehenderit consectetur in quo omnis et ex ut sapiente voluptates.
            Autem magnam consectetur velit. Eveniet similique placeat suscipit.
          </Text>
        </CardBody>
      </Card>
    ) : (
      <Box p={4} borderRadius="md" bg="gray.50">
        <Text>No reviews yet. Be the first to review this course!</Text>
      </Box>
    )}
  </Box>
);

const CategoryInfo = ({ category, subCategory }) => {
  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        Course Categories
      </Heading>
      <HStack spacing={4}>
        <Tag size="lg" colorScheme="purple" borderRadius="full">
          {category?.title}
        </Tag>
        {subCategory && (
          <>
            <Text>→</Text>
            <Tag size="lg" colorScheme="blue" borderRadius="full">
              {subCategory?.title}
            </Tag>
          </>
        )}
      </HStack>
    </Box>
  );
};

const RelatedCourses = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch({
    endpoint: "courses",
  });

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        Students also bought
      </Heading>
      <Flex
        gap="3"
        flexWrap="wrap"
        as={Skeleton}
        isLoaded={!loading}
        fadeDuration="3"
        p="4"
        bgColor="gray.50"
        borderRadius="lg"
        justifyContent="start"
        minH="500px"
      >
        {data?.results?.map((item, index) => {
          return (
            <CourseCard
              {...item}
              key={item.id}
              transition={`${(index + 1) * 0.2}s`}
            />
          );
        })}
      </Flex>
      <Pagination
        isLoading={loading}
        totalPages={data?.pagination?.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default function Index() {
  const { id } = useParams();
  const {
    data: courseData,
    loading,
    error,
  } = useFetch({
    endpoint: `/courses/course-details/${id}/`,
  });

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Skeleton height="400px" mb={8} />
        <Skeleton height="200px" mb={8} />
        <Skeleton height="200px" mb={8} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box p={8} borderRadius="md" bg="red.50" color="red.500">
          <Heading size="md">Error loading course</Heading>
          <Text mt={2}>Please try again later</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <CourseHeader
        title={courseData?.title}
        instructor={courseData?.user?.name || "Instructor"}
        instructorImage={courseData?.user?.profile_pic}
        rating={courseData?.average_rating || 0}
        students={courseData?.total_enrollments || 0}
        price={courseData?.price}
        originalPrice={(courseData?.price * 1.2).toFixed(2)}
        level={courseData?.level}
        language={courseData?.language}
        createdAt={courseData?.created_at}
        image={courseData?.image}
        id={courseData?.id}
        isOwned={courseData?.is_enrolled || false}
      />

      <Divider my={6} />

      <CourseDescription description={courseData?.description} />
      <CourseAttachments attachments={courseData?.course_attachment} />
      <CategoryInfo
        category={courseData?.category}
        subCategory={courseData?.sub_category}
      />
      <LearningPoints />
      <CourseIncludes />
      <CourseContent sections={courseData?.sections || []} />
      <Reviews averageRating={courseData?.average_rating} />
      <RelatedCourses />
    </Container>
  );
}
