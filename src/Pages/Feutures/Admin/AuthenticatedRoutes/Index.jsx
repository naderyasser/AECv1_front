import {
  Flex,
  Skeleton,
  Stack,
  useMediaQuery,
  Text,
} from "@chakra-ui/react";
import { Header } from "../../../../Components/Layout/DashboardHeader/Header";
import { Outlet } from "react-router-dom";
// import AccessDenied from "./AccessDenied/AccessDenied";
import { TabsMenuExpandProvider } from "../../../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { MobileTabMenu, TabsMenu } from "../../../../Components/Layout/Index";
import {
  getUserData,
  useAuth,
} from "../../../../Context/UserDataProvider/UserDataProvider";
import { LazyPageWrapper } from "../../../../Components/Common/Index";
import { FaUsers } from "react-icons/fa";
import { RiDashboardLine, RiUserStarLine } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineVideoLibrary, MdCategory, MdSubtitles } from "react-icons/md";
import { IoStatsChartOutline, IoDocumentTextOutline } from "react-icons/io5";
import { BsPeople, BsPersonVcard } from "react-icons/bs";

const TabsMenuValues = [
  {
    title: <Text>Hi {getUserData().name} In The Dashboard</Text>,
    Icon: RiDashboardLine,
  },
  {
    title: "Admin Profile",
    Icon: HiOutlineUserCircle,
    href: "/user",
  },
  {
    title: "Instructor Applications",
    Icon: RiUserStarLine,
    childsLinks: [
      {
        title: "Pending Applications",
        href: "applications?status=in review",
      },
      {
        title: "Accepted Applications",
        href: "applications?status=accepted",
      },
      {
        title: "Rejected Applications",
        href: "applications?status=rejected",
      },
    ],
  },
  {
    title: "Users",
    Icon: BsPeople,
    childsLinks: [
      {
        title: "Students",
        href: "Users?Role=students",
      },
      {
        title: "Instructors",
        href: "Users?Role=instructors",
      },
      {
        title: "Admins",
        href: "Users?Role=admins",
      },
    ],
  },
  {
    title: "Courses",
    Icon: MdOutlineVideoLibrary,
    href: "courses",
  },
  {
    title: "Analytics",
    Icon: IoStatsChartOutline,
    href: "analytics",
  },
  {
    title: "Categories",
    Icon: MdCategory,
    href: "categories",
  },
  {
    title: "Sub Categories",
    Icon: MdSubtitles,
    href: "sub-categories",
  },
  {
    title: "Assigments Types",
    Icon: IoDocumentTextOutline,
    href: "assigments-types",
  },
];

export default function Index() {
  const { user } = useAuth();
  const [isPhoneQuery] = useMediaQuery("(max-width: 900px)");

  return (
    <TabsMenuExpandProvider>
      <Stack gap="0">
        <Header />
        <Flex
          sx={{
            " > div": {
              overflow: "auto",
              height: "100%",
              bgColor: "gray.50",
              borderRadius: "md",
              border: "1px",
              borderColor: "gray.300",
            },
          }}
          as={Skeleton}
          isLoaded={!user.loading}
          p="3"
          bgColor="blue.white"
          gap="4"
        >
          {isPhoneQuery ? (
            <MobileTabMenu TabsValues={TabsMenuValues} />
          ) : (
            <TabsMenu TabsValues={TabsMenuValues} />
          )}

          <Stack w="100%" h="100%">
            <LazyPageWrapper>
              <Outlet />
            </LazyPageWrapper>
          </Stack>
        </Flex>
      </Stack>
    </TabsMenuExpandProvider>
  );
}
