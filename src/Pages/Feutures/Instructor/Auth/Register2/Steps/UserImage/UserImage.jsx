import { UserImageUploader } from "../../../../../../../Components/Common/UserImageUploader/UserImageUploader";
import Lottie from "lottie-react";
import AnimationData from "../../../../../../../assets/ImageUploaderAnimation/imageUploaderAnimation.json";
import { useWatch } from "react-hook-form";
import { Box, Text, VStack } from "@chakra-ui/react";

export const UserImage = ({ control, setValue }) => {
  const image = useWatch({
    control,
    name: "image",
  });
  const onChangeImage = (file) => setValue("image", file);

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Profile Photo
        </Text>
        <Text fontSize="xs" color="gray.600" lineHeight="1.5">
          Your profile photo is the first impression students will have of you.
          A professional, clear photo helps build trust and credibility. This
          image will be displayed on your instructor profile and course
          listings.
        </Text>
      </Box>

      <UserImageUploader
        onChange={onChangeImage}
        onRemove={() => setValue("image", undefined)}
        img={image}
        description="Upload a professional profile photo. This will be displayed on your instructor profile. Please use a clear, high-quality image where your face is visible. Accepted formats: JPG, JPEG, PNG, GIF."
      >
        <Lottie
          style={{
            width: "100px",
          }}
          animationData={AnimationData}
        />
      </UserImageUploader>
    </VStack>
  );
};
