import { Button, Flex, Skeleton, Stack } from "@chakra-ui/react";
import { CourseCard } from "../../../../../../Components/Common/Index";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useFetch } from "../../../../../../Hooks/Index";

const Links = [
  {
    title: "Sections",
    href: "sections",
  },
  {
    title: "Quizes",
    href: "quizes",
  },
  {
    title: "Lessons",
    href: "lessons",
  },
  {
    title: "Attachments",
    href: "attachments",
  },
  {
    title: "Course Members",
    href: "members",
  },
  {
    title: "How Course Will look Like To User",
    href: "userView",
  },
];

export default function Index() {
  const { id } = useParams();
  const location = useLocation();
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/courses/course-details/${id}/`,
  });

  const isActive = (href) => {
    const pathSegments = location.pathname.split("/");

    // Check if the current path contains the href
    if (pathSegments.includes(href)) {
      return true;
    }

    // Special case for root path
    if (href === "sections" && pathSegments[pathSegments.length - 1] === id) {
      return true;
    }

    // Check for nested routes
    if (
      href === "quizes" &&
      (pathSegments.includes("quizes") ||
        pathSegments.includes("AddQuestions") ||
        pathSegments.includes("questions"))
    ) {
      return true;
    }

    if (href === "lessons" && pathSegments.includes("lessons")) {
      return true;
    }

    if (href === "members" && pathSegments.includes("members")) {
      return true;
    }

    if (href === "attachments" && pathSegments.includes("attachments")) {
      return true;
    }

    if (href === "userView" && pathSegments.includes("userView")) {
      return true;
    }

    return false;
  };

  return (
    <Flex
      pos="relative"
      border="0px"
      gap="5"
      bgColor="blue.500"
      p="3"
      flexWrap={{
        base: "wrap",
        lg: "nowrap",
      }}
      alignItems="start"
    >
      <Skeleton
        w="lg"
        flexGrow="1"
        maxW="100%"
        isLoaded={!loading}
        borderRadius="2xl"
      >
        <CourseCard
          isLink={false}
          maxW="100%"
          w="100%"
          h="100%"
          border="0px"
          {...data}
        />
      </Skeleton>

      <Stack
        mb="auto"
        h="100%"
        bgColor="white"
        gap="3"
        borderRadius="xl"
        w="100%"
        p="3"
      >
        <Flex wrap="wrap" bgColor="gray.50" p="3" borderRadius="lg" gap="4">
          {Links.map((item) => {
            const active = isActive(item.href);
            return (
              <Button
                bgColor={active ? "blue.500" : "white"}
                color={active ? "white" : "blue.500"}
                colorScheme="blue"
                variant={active ? "solid" : "outline"}
                key={item.title}
                borderRadius="full"
                as={Link}
                to={item.href}
                _hover={{
                  bgColor: active ? "blue.600" : "blue.50",
                }}
              >
                {item.title}
              </Button>
            );
          })}
        </Flex>
        <Outlet context={{ data, loading, error, HandleRender }} />
      </Stack>
    </Flex>
  );
}
