import {
  Button,
  Flex,
  IconButton,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Logo } from "../../Common/Index";
import { SearchField } from "../../Common/Index";
import { Title } from "../../Common/SearchField/SearchField";
import { HiBars3 } from "react-icons/hi2";
import { Links } from "./Links";
import { SideMenu } from "./SideMenu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/UserDataProvider/UserDataProvider";
import { FaUser } from "react-icons/fa";
import { StyledBtn } from "../../Common/StyledBtn/StyledBtn";
import { LogoutBtn } from "../../Common/LogoutBtn/LogoutBtn";
import { useFetch } from "../../../Hooks/useFetch/useFetch";
import { BaseNavigationHandler } from "../../../Utils/BaseNavigationHandler/BaseNavigationHandler";
import { switchUserRole } from "../../../Utils/RoleSwitcher/RoleSwitcher";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  return scrollDirection;
}

const LinkButton = ({ children, ...rest }) => {
  return (
    <Button
      as={Link}
      size="md"
      colorScheme="blackAlpha"
      variant="ghost"
      pos="relative"
      _after={{
        content: `""`,
        w: "0%",
        height: "1px",
        pos: "absolute",
        bgColor: "black",
        bottom: "0",
        transition: "0.3s",
        right: "0",
      }}
      _before={{
        content: `""`,
        w: "0%",
        height: "1px",
        pos: "absolute",
        bgColor: "black",
        top: "0",
        transition: "0.3s",
        left: "0",
      }}
      _hover={{
        _after: {
          w: "100%",
        },
        _before: {
          w: "100%",
        },
      }}
      textTransform="capitalize"
      {...rest}
    >
      {children}
    </Button>
  );
};

export const Header = () => {
  const [isPhoneQuery] = useMediaQuery("(max-width: 990px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const scrollDirection = useScrollDirection();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ensure the fetch happens on mount by adding useEffect
  const { data, loading, HandleRender } = useFetch({
    endpoint: "/instractor-application",
  });

  // Force initial fetch similar to how it works in Courses component
  React.useEffect(() => {
    // Only fetch if user is logged in to avoid unnecessary requests
    if (user.data) {
      HandleRender();
    }
  }, [user.data]); // Depend on user.data to fetch when user logs in

  const handleInstructorNavigation = () => {
    // Only proceed if user is logged in
    if (!user.data) {
      navigate("/login");
      return;
    }

    // Refresh data to ensure we have the latest status
    HandleRender();

    // Check application status from the data
    if (data && data.results && data.results.length > 0) {
      const applicationStatus = data.results[0].status;

      if (applicationStatus === "approved") {
        switchUserRole("instructor", false);
        BaseNavigationHandler(`instructor/`);
      } else {
        // If status is "in review" or "declined", pass the status as state
        switchUserRole("instructor", false);
        BaseNavigationHandler(
          `instructor/application-status/${applicationStatus}`
        );
      }
    } else {
      // If no application exists, redirect to application page
      switchUserRole("instructor", false);
      BaseNavigationHandler("instructor/register");
    }
  };

  return (
    <>
      <SideMenu isOpen={isOpen} onClose={onClose} />
      <Flex
        pos="sticky"
        top="0"
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="8"
        px="30px"
        py="20px"
        flexWrap="wrap"
        transition="0.3s"
        sx={{
          translate: scrollDirection === "down" ? "0% -100%" : "0% 0%",
        }}
        zIndex="100"
        bgColor={scrollDirection === "up" && "white"}
      >
        <Link to="/">
          <Logo w="80px" />
        </Link>
        <SearchField
          BtnStyles={
            !isPhoneQuery && {
              w: "100%",
              maxWidth: "350px",
              justifyContent: "space-between",
              borderRadius: "full",
              size: "lg",
            }
          }
          variant={isPhoneQuery ? "IconButton" : "Bar"}
        >
          <Title>Search</Title>
        </SearchField>
        <Flex
          display={{
            base: "none",
            xl: "flex",
          }}
          alignItems="center"
          gap="3"
        >
          {Links.slice(0, 3).map((link) => {
            return (
              <LinkButton to={link.href} key={link.title}>
                {link.title}
              </LinkButton>
            );
          })}
        </Flex>
        <IconButton
          display={{
            base: "flex",
            xl: "none",
          }}
          onClick={onOpen}
        >
          <HiBars3 />
        </IconButton>
        <StyledBtn
          display={{
            base: "none",
            lg: "flex",
          }}
          onClick={handleInstructorNavigation}
          isLoading={loading}
        >
          Become A Tutor
        </StyledBtn>
        <Flex
          display={{
            base: "none",
            lg: "flex",
          }}
          gap="3"
          alignItems="center"
          justifyContent="center"
        >
          {user.data ? (
            <>
              <Link to="/profile">
                <StyledBtn theme="blue">
                  Profile
                  <FaUser />
                </StyledBtn>
              </Link>

              <LogoutBtn />
            </>
          ) : (
            <>
              <Link to="/login">
                <StyledBtn theme="blue">Login</StyledBtn>
              </Link>
              <Link to="/register">
                <StyledBtn theme="blue">Register</StyledBtn>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};
