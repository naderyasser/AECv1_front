import { AspectRatio, Box, Button, Flex, Stack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import React, { useMemo, useState } from "react";
import AnimationData from "../../../Assets/ImageUploaderAnimation/imageUploaderAnimation.json";
import ReactPlayer from "react-player";
export const VideoUploader = ({
  containerStyles,
  onChange,
  video,
  uploadingTitle = "Upload Video",
  EditTitle = "Change Video",
}) => {
  const uniqueId = useMemo(() => {
    return `video-Uploader=${Math.random()}`;
  }, []);

  const renderedVideo = useMemo(() => {
    return video && video instanceof File
      ? URL.createObjectURL(video)
      : video?.url;
  }, [video]);
  return (
    <Stack
      w="100%"
      {...containerStyles}
      border="2px"
      borderColor="blue.600"
      borderRadius="lg"
      bgColor="blue.400"
      justifyContent="center"
      alignItems="center"
      p="3"
    >
      {!video && (
        <>
          <Box overflow="hidden" p="3" bgColor="blue.600" borderRadius="full">
            <Box className="show-up-animation">
              <Lottie
                style={{
                  width: "130px",
                  height: "130px",
                }}
                animationData={AnimationData}
              />
            </Box>
          </Box>
          <Button
            w="100%"
            maxW="300px"
            colorScheme="blue"
            variant="outline"
            bgColor="gray.50"
            as="label"
            htmlFor={uniqueId}
            cursor="pointer"
          >
            <input
              onChange={(e) => onChange(e.target.files[0])}
              type="file"
              accept="video/*"
              hidden
              id={uniqueId}
            />
            {uploadingTitle}
          </Button>
        </>
      )}
      {video && (
        <>
          <Stack
            maxW="600px"
            w="100%"
            p="0"
            overflow="hidden"
            borderRadius="lg"
          >
            {video instanceof File ? (
              <ReactPlayer
                height="100%"
                width="100%"
                controls
                url={renderedVideo}
              />
            ) : (
              <AspectRatio ratio={16 / 9}>
                <iframe src={renderedVideo} allowFullScreen />
              </AspectRatio>
            )}
          </Stack>
          <Flex mt="3" gap="3" justifyContent="center">
            <Button
              colorScheme="green"
              as="label"
              htmlFor={uniqueId}
              cursor="pointer"
            >
              <input
                onChange={(e) => onChange(e.target.files[0])}
                type="file"
                accept="video/*"
                hidden
                id={uniqueId}
              />
              {EditTitle.trim()}
            </Button>
            <Button colorScheme="red" onClick={() => onChange(undefined)}>
              delete
            </Button>
          </Flex>
        </>
      )}
    </Stack>
  );
};
