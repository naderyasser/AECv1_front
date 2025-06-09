import {
  Button,
  Code,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import PropTypes from "prop-types";
import { SearchModal } from "./SearchModal";

export const Title = ({ children }) => {
  return children;
};
export const Results = ({ children }) => {
  return children.map((child, index) => {
    return <Flex key={index}>{child.title}</Flex>;
  });
};
export const SearchField = ({
  variant = "Bar",
  children,
  TooltipLabel,
  ShortCuts,
  BtnStyles,
  ShowModalAsCenterd,
  colorScheme = "blue",
  onSubmit,
  ...rest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState();
  const [SearchResults, setSearchResults] = useState();
  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (child.type === Title) {
        setTitle(child.props.children);
      } else if (child.type === Results) {
        setSearchResults(child.props.children);
      }
    });
  }, [children]);
  return (
    <>
      <SearchModal
        isCentered={ShowModalAsCenterd}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        onSubmit={onSubmit}
        {...rest}
      >
        {SearchResults}
      </SearchModal>
      {variant === "Bar" && (
        <Tooltip label={TooltipLabel}>
          <Button
            rightIcon={<BsSearch />}
            variant="outline"
            borderRadius="lg"
            onClick={onOpen}
            boxShadow="0px 2px 2px 0px  rgba(220, 220, 220, 0.809)"
            colorScheme={colorScheme}
            bgColor="white"
            gap="3"
            {...BtnStyles}
          >
            {title}
          </Button>
        </Tooltip>
      )}
      {variant === "IconButton" && (
        <Tooltip label={TooltipLabel}>
          <IconButton onClick={onOpen} {...BtnStyles}>
            <BsSearch />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};
SearchField.propTypes = {
  variant: PropTypes.oneOf(["Bar", "IconButton"]).isRequired,
  TooltipLabel: PropTypes.string,
};
