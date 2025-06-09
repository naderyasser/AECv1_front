import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
  Stack,
} from "@chakra-ui/react";
import React, { useMemo, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { BiEdit } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { LazyLoadedImage } from "../LazyLoadedImage/LazyLoadedImage";

export const ImageUploader = ({
  img,
  onChangeImage,
  onRemoveImage,
  label,
  BtnLabelProps,
  isInvalid,
  currentImageUrl, // Add this prop to handle existing image URLs
  ...rest
}) => {
  const fileInputRef = useRef(null);

  const ImageSrc = useMemo(() => {
    return img && img instanceof File ? URL.createObjectURL(img) : img;
  }, [img]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    onChangeImage(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChangeImage(file);
    }
  };

  return (
    <Box
      border="1px dashed"
      borderColor={isInvalid ? "red.500" : "gray.300"}
      borderRadius="md"
      w="100%"
      h="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      bg={isInvalid ? "red.50" : "white"}
      {...rest}
    >
      {img ? (
        // Show selected image if there's a File object
        <Box position="relative" w="100%" h="100%">
          <LazyLoadedImage
            ImageProps={{
              transition: "0.3s",
              objectFit: "contain",
            }}
            decoding="async"
            loading="lazy"
            w="100%"
            h="100%"
            src={ImageSrc}
            bgColor="gray.500"
          />
          <IconButton
            icon={<GiCancel />}
            colorScheme="red"
            aria-label="Remove image"
            size="sm"
            position="absolute"
            top="8px"
            right="8px"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage();
            }}
          />
        </Box>
      ) : currentImageUrl ? (
        // Show the current image URL if available
        <Box position="relative" w="100%" h="100%">
          <img
            src={currentImageUrl}
            alt="Current"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              maxHeight: "300px",
            }}
          />
          <IconButton
            icon={<MdDelete />}
            colorScheme="red"
            aria-label="Remove image"
            size="sm"
            position="absolute"
            top="8px"
            right="8px"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage();
            }}
          />
        </Box>
      ) : (
        // Show the upload label when no image is selected
        <Box
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          p="4"
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outline"
            colorScheme={isInvalid ? "red" : "blue"}
            minH="fit-content"
            pos="relative"
            w="100%"
            maxW="600px"
            {...BtnLabelProps}
          >
            <Stack opacity="0" pos="absolute" h="100%" w="100%" zIndex="10">
              <FileUploader
                handleChange={onChangeImage}
                name="file"
                types={["png", "jpg"]}
                classes="drop_zone file-drop"
              />
            </Stack>

            {label}
          </Button>
        </Box>
      )}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </Box>
  );
};
