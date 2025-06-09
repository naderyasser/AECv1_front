import { Flex, Skeleton, Stack, useMediaQuery, Text } from "@chakra-ui/react";
import { Header } from "../../../../Components/Layout/DashboardHeader/Header";
import { Outlet } from "react-router-dom";
import { TabsMenuExpandProvider } from "../../../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { MobileTabMenu, TabsMenu } from "../../../../Components/Layout/Index";
import {
  getUserData,
  useAuth,
} from "../../../../Context/UserDataProvider/UserDataProvider";
import { LazyPageWrapper } from "../../../../Components/Common/Index";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoStatsChartOutline, IoDocumentTextOutline } from "react-icons/io5";
import { BsBook, BsPeople } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";

const TabsMenuValues = [
  {
    title: <Text>Hi {getUserData()?.name} In The Dashboard</Text>,
    Icon: RiDashboardLine,
  },
  {
    title: "Instructor Profile",
    Icon: HiOutlineUserCircle,
    href: "/user",
  },
  {
    title: "My Courses",
    Icon: MdOutlineVideoLibrary,
    href: "courses",
  },
  {
    title: "Create Course",
    Icon: BsBook,
    href: "courses/add",
  },
  {
    title: "My Students",
    Icon: BsPeople,
    href: "students",
  },
  {
    title: "Course Analytics",
    Icon: IoStatsChartOutline,
    href: "analytics",
  },
  {
    title: "Assignments",
    Icon: IoDocumentTextOutline,
    href: "assignments",
  },
  {
    title: "Teaching Tools",
    Icon: FaChalkboardTeacher,
    href: "tools",
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
