import { useEffect, useRef, useState, useTransition } from "react";
import { TabElement } from "./TabElement";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Skeleton,
  Stack,
  Tabs,
  useMediaQuery,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useTabsMenuStatus } from "../../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { SearchField, Title } from "../../Common/SearchField/SearchField";
export const TabsMenu = ({ isDrawer, TabsValues = [] }) => {
  const TabsMenuRef = useRef();
  // pathname cahnging handler =>{
  const { pathname } = useLocation();
  function getStringAfterSlash(str) {
    const lastIndex = str.lastIndexOf("/");

    if (lastIndex !== -1) {
      const substring = str.substring(lastIndex + 1);
      return substring;
    } else {
      return str;
    }
  }
  const getPathNameIndex = () => {
    return TabsValues.indexOf(
      TabsValues.find((item) => {
        return item.href === getStringAfterSlash(pathname);
      })
    );
  };
  const [value, setValue] = useState(getPathNameIndex());
  const HandleChange = (index) => {
    setValue(index);
  };
  // }

  const { isOpen } = useTabsMenuStatus();

  return (
    <>
      <Stack
        borderRadius="lg"
        flexShrink="0"
        bgColor="gray.50"
        h="100%"
        alignItems="center"
      >
        <Tabs
          orientation="vertical"
          flexDirection="column"
          alignItems="center"
          w={`${isDrawer ? "100%" : isOpen ? "300px" : "80px"}`}
          h="100%"
          overflowX="hidden"
          overflowY="auto"
          index={value}
          onChange={HandleChange}
          transition="0.3s"
          borderLeft="2px"
          borderLeftColor="gray.200"
          className="scrollable"
          ref={TabsMenuRef}
        >
          {TabsValues.map((tab, index) => {
            const { href, title, Icon, childsLinks } = tab;
            return (
              <TabElement
                key={index}
                href={href}
                title={title}
                icon={<Icon />}
                expand={isOpen}
                childLinks={childsLinks}
              />
            );
          })}
          <Stack gap="0" p="2" w="100%" alignItems="center">
            <SearchField
              BtnStyles={{ m: "2", w: "100%" }}
              variant={isOpen ? "Bar" : "IconButton"}
            >
              <Title>Search for a course</Title>
            </SearchField>

            <SearchField
              BtnStyles={{ m: "2", w: "100%" }}
              variant={isOpen ? "Bar" : "IconButton"}
            >
              <Title>Search for a student</Title>
            </SearchField>
          </Stack>
        </Tabs>
      </Stack>
    </>
  );
};
export const MobileTabMenu = ({ TabsValues }) => {
  const { isOpen, onClose } = useTabsMenuStatus();
  const { pathname } = useLocation();
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Drawer onClose={onClose} size="sm" isOpen={isOpen} placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          borderBottomStyle={"solid"}
          borderBottomWidth={1}
          borderBottomColor={"gray.100"}
        >
          Menu
        </DrawerHeader>

        <DrawerBody bgColor="gray.50" overflow="auto" as={Stack} p={0}>
          <TabsMenu TabsValues={TabsValues} isDrawer={true} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
