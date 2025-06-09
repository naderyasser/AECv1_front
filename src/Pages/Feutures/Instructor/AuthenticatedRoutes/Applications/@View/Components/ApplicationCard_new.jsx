import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Button,
  Flex,
  Avatar,
  IconButton,
  Tooltip,
  Text,
  AvatarBadge,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";

import { CountryFlagButton } from "../../../../../../../Components/Common/Index";
import { SlUserFemale } from "react-icons/sl";
import { CiUser } from "react-icons/ci";
import { MdFileOpen, MdGpsFixed, MdWhatsapp } from "react-icons/md";
import { useFetch } from "../../../../../../../Hooks/useFetch/useFetch";

const GetColorByStatus = (status) => {
  if (status === "in review") {
    return "orange";
  }
  if (status === "approved") {
    return "green";
  }
  if (status === "rejected") {
    return "red";
  }
};

const ApplicationCardDrawer = ({
  isOpen,
  onClose,
  data: {
    first_name,
    photos,
    status,
    email,
    gender,
    nationality,
    id,
    middle_name,
    age,
    phone_number,
    place,
    university_degree,
    certificate,
    cv,
    sub_category,
    category,
  },
}) => {
  const {
    data: Category,
    loading: CategoryLoading,
    error: CategoryError,
  } = useFetch({
    endpoint: "categories/",
  });
  const {
    data: SubCategory,
    loading: SubCatogiryLoading,
    error: SubCategoryError,
  } = useFetch({
    endpoint: "sub-categories/",
  });

  return (
    <Drawer isOpen={isOpen} size="md" placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Application of {first_name}</DrawerHeader>

        <DrawerBody>
          <Stack borderRadius="lg" gap="2" alignItems="center">
            <Stack
              pos="relative"
              w="100%"
              bgColor="blue.500"
              h="200px"
              borderRadius="2xl"
            >
              <Avatar
                size="2xl"
                pos="absolute"
                bottom="-10"
                left="50%"
                sx={{
                  translate: "-50% 0%",
                }}
                src={photos[0]}
                name={first_name}
                bgColor="blue.900"
                color="white"
              />
            </Stack>
            <Stack gap="3" w="100%" maxW="500px" mt="20">
              <Button
                size="lg"
                textTransform="capitalize"
                colorScheme={GetColorByStatus(status)}
                variant="outline"
              >
                {status}
              </Button>
              <Button size="lg" variant="ghost">
                {first_name} {middle_name}
              </Button>
              <Button size="lg" variant="ghost">
                {email}
              </Button>
              <Button size="lg" variant="ghost">
                University Degree : {university_degree}
              </Button>

              <CountryFlagButton
                size="lg"
                countryCode={nationality}
                viewName={(name) => {
                  return <Text>{name}</Text>;
                }}
              />

              <Flex
                as={Skeleton}
                isLoaded={!SubCatogiryLoading && !CategoryLoading}
                gap="3"
              >
                <Button size="lg" flexGrow="1">
                  Category : {Category?.title}
                </Button>
                <Button size="lg" flexGrow="1">
                  Sub Category : {SubCategory?.title}
                </Button>
              </Flex>

              <Flex gap="3">
                <Button>{age}</Button>
                <Button>{gender}</Button>
                <Button
                  flexGrow="1"
                  colorScheme="green"
                  rightIcon={<MdWhatsapp />}
                >
                  {phone_number}
                </Button>
                <Button leftIcon={<MdGpsFixed />}>{place}</Button>
              </Flex>

              <Flex gap="3">
                <Button
                  colorScheme="orange"
                  variant="outline"
                  size="lg"
                  flexGrow="1"
                  h="100px"
                  flexDir="column"
                  gap="3"
                  as="a"
                  target="_blank"
                  href={certificate}
                  cursor="pointer"
                >
                  <MdFileOpen />
                  Certificate
                </Button>
                <Button
                  colorScheme="orange"
                  variant="outline"
                  size="lg"
                  flexGrow="1"
                  h="100px"
                  flexDir="column"
                  gap="3"
                  as="a"
                  target="_blank"
                  href={cv}
                  cursor="pointer"
                >
                  <MdFileOpen />
                  Cv
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </DrawerBody>

        <DrawerFooter gap="4">
          <Button variant="outline" colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const ApplicationCard = ({
  photos,
  status,
  first_name,
  email,
  gender,
  nationality,
  id,
  middle_name,
  age,
  phone_number,
  place,
  certificate,
  cv,
  university_degree,
  sub_category,
  category,
  onRender = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isOpen && (
        <ApplicationCardDrawer
          isOpen={isOpen}
          onClose={onClose}
          data={{
            photos,
            status,
            first_name,
            email,
            gender,
            nationality,
            id,
            middle_name,
            age,
            phone_number,
            place,
            certificate,
            cv,
            university_degree,
            sub_category,
            category,
          }}
        />
      )}

      <Card
        _hover={{
          boxShadow: "lg",
          translate: "0 -10px",
        }}
        transition="0.3s"
        w="lg"
        flexGrow="1"
        maxW="lg"
      >
        <CardBody>
          <Stack mt="3" spacing="3">
            <Flex
              flexWrap="wrap"
              alignItems="center"
              justifyContent="space-between"
              gap="3"
            >
              <Flex alignItems="center" gap="3">
                <Tooltip label="User Photo">
                  <IconButton
                    w="fit-content"
                    h="fit-content"
                    borderRadius="full"
                  >
                    <Avatar src={photos[0]}>
                      <AvatarBadge
                        borderColor="papayawhip"
                        bg="green"
                        boxSize="1em"
                      />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Stack justifyContent="center" gap="0">
                  <Text>{first_name}</Text>
                  <Text>{email}</Text>
                </Stack>
              </Flex>
              <Flex>
                <Button
                  textTransform="capitalize"
                  variant="ghost"
                  colorScheme={GetColorByStatus(status)}
                >
                  {status}
                </Button>
                <Tooltip label={gender}>
                  <IconButton colorScheme="blue" variant="ghost">
                    {gender === "male" ? <CiUser /> : <SlUserFemale />}
                  </IconButton>
                </Tooltip>
                <CountryFlagButton countryCode={nationality} />
              </Flex>
            </Flex>
          </Stack>
        </CardBody>
        <Divider borderColor="gray.400" />
        <CardFooter>
          <Flex gap="3" flexWrap="wrap" spacing="2">
            <Button
              flexGrow="1"
              onClick={onOpen}
              variant="outline"
              colorScheme="blue"
            >
              View Details
            </Button>
            <Button
              flexGrow="1"
              colorScheme={GetColorByStatus(status)}
              variant="outline"
            >
              {status === "in review"
                ? "Under Review"
                : status === "approved"
                ? "Approved!"
                : "Rejected"}
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </>
  );
};
