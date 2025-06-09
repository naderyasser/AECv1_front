import {
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  AnimatedText,
  CenteredTextWithLines,
  InputElement,
  LazyLoadedImage,
  PasswordInput,
} from "../../../../../Components/Common/Index";
import ShipImage from "../../../../../assets/ShapeImage/Image.png";
import { MdEmail } from "react-icons/md";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Student } from "../../../../../$Models/Student";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function Index() {
  const { onAuth } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    const { data: ResponceData, error } = await Student.Login(data);
    if (error) {
      toast({
        title: "error",
        status: "error",
        description: error?.message,
      });
      return;
    }
    toast({
      title: "login successfully",
      status: "success",
    });
    onAuth({ ...ResponceData?.data, ...data }, "Admin");
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="100%"
      minH="calc(100vh - 88px)"
      gap="12"
    >
      <Stack
        gap="3"
        w="100%"
        maxW="500px"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading size="lg">
          Welcome To{" "}
          <span
            style={{
              color: "blue",
            }}
          >
            <span
              style={{
                color: "red",
              }}
            >
              A
            </span>
            EC
          </span>
        </Heading>
        <AnimatedText>
          <Text mb="10" color="gray.600">
            With AEC academy you can learn quickly and easily than any other
            academy with highly experienced teachers.
          </Text>
        </AnimatedText>

        <FormControl isInvalid={!!errors.email}>
          <InputElement
            register={register}
            name="email"
            placeholder="Email"
            size="lg"
            Icon={MdEmail}
            {...register("email")}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <PasswordInput
            size="lg"
            Icon={FaUnlockKeyhole}
            placeholder="Password"
            varient="filled"
            {...register("password")}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Flex
          gap="4"
          w="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Checkbox {...register("rememberMe")} color="gray.600">
            Remember Me
          </Checkbox>
          <Button variant="link">Forget Password</Button>
        </Flex>

        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
          Login
        </Button>

        <CenteredTextWithLines>
          <Text color="gray.600" flexShrink="0">
            Continue With
          </Text>
        </CenteredTextWithLines>

        <Flex justifyContent="center" gap="3">
          <IconButton
            borderRadius="full"
            size="lg"
            colorScheme="red"
            variant="outline"
            aria-label="Login with Google"
          >
            <FaGoogle />
          </IconButton>
          <IconButton
            borderRadius="full"
            size="lg"
            colorScheme="blue"
            variant="outline"
            aria-label="Login with Facebook"
          >
            <FaFacebook />
          </IconButton>
        </Flex>
      </Stack>

      <LazyLoadedImage
        w="100%"
        maxW="400px"
        ImageProps={{
          objectFit: "contain",
        }}
        src={ShipImage}
      />
    </Flex>
  );
}
