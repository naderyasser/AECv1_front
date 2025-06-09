import { Avatar, Button, IconButton, Stack } from "@chakra-ui/react";
import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { Link } from "react-router-dom";
export const UserAvatar = ({
  profilePhoto,
  email,
  isAuthenticated,
  phoneNumber,
}) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        w="fit-content"
        h="fit-content"
        p="1"
        borderRadius="full"
      >
        <Avatar src={profilePhoto} size="sm" />
      </MenuButton>
      {isAuthenticated && (
        <MenuList w="200px">
          {links.map((link, index) => {
            return (
              <MenuItem
                _hover={{ pr: "5" }}
                transition="0.2s"
                paddingBlock="3"
                key={index}
                as={Link}
                to={link.href}
              >
                {link.title}
              </MenuItem>
            );
          })}
          <MenuItem
            whiteSpace="wrap"
            _hover={{ pr: "5" }}
            transition="0.2s"
            paddingBlock="3"
            lineHeight="7"
            fontSize="sm"
          >
            email {email}
          </MenuItem>
          <MenuItem
            whiteSpace="wrap"
            _hover={{ pr: "5" }}
            transition="0.2s"
            paddingBlock="3"
            lineHeight="7"
            fontSize="sm"
          >
            phone number {phoneNumber}
          </MenuItem>
          <LogoutButton w="100%" mt="1" borderRadius="0" />
        </MenuList>
      )}
    </Menu>
  );
};
const links = [{ title: "profile", href: "/user", colorScheme: "blue" }];
