import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AnimatedText,
  LazyLoadedImage,
} from "../../../Components/Common/Index";
import HeroImage from "../../../assets/Landing/Muslim.png";
import ElapseShape from "../../../assets/Shapes/Image.png";
import { MdNotifications } from "react-icons/md";
import { StyledBtn } from "../../../Components/Common/StyledBtn/StyledBtn";
import { BaseNavigationHandler } from "../../../Utils/BaseNavigationHandler/BaseNavigationHandler";
export const Hero = () => {
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true });
  return (
    <Flex
      alignItems="center"
      minH="calc(100vh - 88px)"
      p="5"
      justifyContent="center"
      gap={{
        base: "10",
        lg: "40",
      }}
      flexWrap="wrap-reverse"
      overflow="hidden"
      pos="relative"
    >
      <Alert
        alignItems="center"
        justifyContent="center"
        pos="absolute"
        top="0"
        status="info"
        transition="0.3s"
        sx={{
          transform: isVisible
            ? "translate(0px , 0px)"
            : "translate(0px , -80px)",
        }}
        zIndex="10"
      >
        <AlertIcon />
        To make your Ads
        <Button ml="5" borderRadius="full" colorScheme="red">
          Click Here
        </Button>
        <CloseButton onClick={onClose} pos="absolute" right="5" />
      </Alert>
      <LazyLoadedImage
        zIndex="-1"
        pos="absolute"
        top="-5"
        left="-2"
        src={ElapseShape}
      />

      <Stack gap="4" w="100%" maxW="500px">
        <Text fontWeight="bold" color="blue.600" fontSize="xs">
          Hundreds of courses in one place
        </Text>
        <AnimatedText spacing="10px">
          <Heading textTransform="capitalize" size="xl">
            Looking for a life changer courses to Subscribe?
          </Heading>
        </AnimatedText>
        <AnimatedText>
          <Text color="gray.500">
            Find courses with rich content for your Career like Tech,
            Programming, Designing and even much more.
          </Text>
        </AnimatedText>

        <Divider />
        <Flex flexWrap="wrap" gap="4">
          {/* <StyledBtn mt="0" theme="blue">
            Request Your Service
          </StyledBtn> */}
          <StyledBtn
            onClick={() => BaseNavigationHandler("instructor/register")}
            mt="0"
          >
            Become A Tutor
          </StyledBtn>

          {!isVisible && (
            <StyledBtn theme="orange" onClick={onOpen} mt="0">
              <MdNotifications />
            </StyledBtn>
          )}
        </Flex>
      </Stack>
      <LazyLoadedImage
        ImageProps={{
          objectFit: "cover",
        }}
        w="100%"
        maxW="500px"
        src={HeroImage}
        zIndex="1"
        transition="0.3s"
        className="image-box"
      />
    </Flex>
  );
};
