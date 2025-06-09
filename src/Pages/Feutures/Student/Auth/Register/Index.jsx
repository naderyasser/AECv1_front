import {
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Progress,
  Select,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
  CenteredTextWithLines,
  InputElement,
  PasswordInput,
} from "../../../../../Components/Common/Index";
import { FaFacebook, FaGoogle, FaUser } from "react-icons/fa";
import { FaPuzzlePiece, FaUnlockKeyhole } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { ErrorText } from "../../../../../Components/Common/ErrorText/ErrorText";
import { checkPasswordComplexity } from "../../../../../Utils/CheckPasswordComplexity/CheckPasswordComplexity";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SubmitButton } from "../../../../../Components/Common/Index";
import { Student } from "../../../../../$Models/Student";
import { BaseNavigationHandler } from "../../../../../Utils/BaseNavigationHandler/BaseNavigationHandler";

export default function Index() {
  const navigate = useNavigate();
  const [search] = useSearchParams("willBecomeTutor");
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    setError,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });
  const Password = useWatch({ control, name: "password" });
  const PasswordComplexity = useMemo(
    () => checkPasswordComplexity(Password || ""),
    [Password]
  );
  const { data: Categories, loading: CatogiriesLoading } = useFetch({
    endpoint: "categories",
  });

  const onSubmit = async (data) => {
    const { data: ResponceData, error } = await Student.createAccount(data);

    if (error) {
      const ErrorData = error?.originalError?.response?.data;
      for (let key in ErrorData) {
        setError(key, {
          message: ErrorData[key].join(`\n`),
        });
        for (let error of ErrorData[key]) {
          toast({
            title: "error",
            status: "error",
            description: error,
          });
        }
      }
      return;
    }
    toast({
      status: "success",
      title: "User Created Successfully",
    });

    navigate("/login");

    // await onAuth({ ...ResponceData, ...data });

    if (search.get("willBecomeTutor")) {
      BaseNavigationHandler("./instructor/register");
    }
  };
  return (
    <Stack
      justifyContent="center"
      minH="calc(100vh - 88px)"
      alignItems="center"
      p="4"
      gap="4"
    >
      <Heading textAlign="center">
        Welcome to{" "}
        <span
          style={{
            color: "blue",
          }}
        >
          <span style={{ color: "red" }}>A</span>
          EC
        </span>
      </Heading>
      <Text
        w="100%"
        maxW="600px"
        color="gray.500"
        fontWeight="semibold"
        textAlign="center"
      >
        With AEC academy you can learn quickly and easily than any other academy
        with highly experienced teachers.
      </Text>
      <Divider mt="3" w="100%" maxW="500px" />
      <Container
        flexWrap="wrap"
        gap="8"
        as={Flex}
        w="100%"
        maxW="container.lg"
        mt="5"
        justifyContent="center"
        alignItems="start"
      >
        <Stack gap="3" w="400px" flexGrow="1">
          <InputElement
            register={register}
            name="name"
            size="lg"
            Icon={FaUser}
            placeholder="Full name"
            errors={errors}
          />
          <Skeleton minH="50px" isLoaded={!CatogiriesLoading}>
            <InputElement
              register={register}
              name="category"
              as={Select}
              Icon={FaPuzzlePiece}
              placeholder="Category"
              size="lg"
              errors={errors}
            >
              {Categories?.map((category) => {
                return (
                  <option value={category.id} key={category.id}>
                    {category.title}
                  </option>
                );
              })}
            </InputElement>
          </Skeleton>

          <InputElement
            register={register}
            name="email"
            size="lg"
            Icon={MdEmail}
            placeholder="Email"
            errors={errors}
          />
        </Stack>
        <Stack gap="3" w="400px" flexGrow="1">
          <InputElement
            register={register}
            name="phone"
            size="lg"
            Icon={FaPhone}
            placeholder="Phone Number"
            errors={errors}
          />
          <InputElement
            register={register}
            name="sex"
            as={Select}
            size="lg"
            Icon={FaUser}
            placeholder="Gender"
            errors={errors}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </InputElement>
          <Stack gap="0">
            <PasswordInput
              {...register("password")}
              Icon={FaUnlockKeyhole}
              placeholder="Password"
              varient="filled"
              size="lg"
              errors={errors}
            />
            {!Password && (
              <ErrorText my="2">{errors?.password?.message}</ErrorText>
            )}

            {Password && (
              <>
                <Text
                  fontWeight="semibold"
                  color={
                    PasswordComplexity.score >= 6
                      ? "green.500"
                      : PasswordComplexity.score >= 4
                      ? "orange.500"
                      : "red.500"
                  }
                  my="2"
                >
                  Password is {PasswordComplexity.level}
                </Text>
                <Progress
                  colorScheme={
                    PasswordComplexity.score >= 6
                      ? "green"
                      : PasswordComplexity.score >= 4
                      ? "orange"
                      : "red"
                  }
                  sx={{
                    transition: "0.3s",
                  }}
                  my="2"
                  borderRadius="lg"
                  value={(PasswordComplexity.score / 8) * 100}
                />
                {PasswordComplexity.feedback.map((item) => {
                  return (
                    <ErrorText
                      key={item.message}
                      color={item.type === "positive" ? "green.500" : "red.500"}
                    >
                      {item.message}
                    </ErrorText>
                  );
                })}
              </>
            )}
          </Stack>
        </Stack>
      </Container>
      <SubmitButton
        w="100%"
        maxW="400px"
        mt="4"
        h="50px"
        borderRadius="full"
        colorScheme="blue"
        bgColor="blue"
        onClick={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        gap="15px"
        fontSize="lg"
      >
        Register
      </SubmitButton>

      <CenteredTextWithLines w="100%" maxW="400px">
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
        >
          <FaGoogle />
        </IconButton>
        <IconButton
          borderRadius="full"
          size="lg"
          colorScheme="blue"
          variant="outline"
        >
          <FaFacebook />
        </IconButton>
      </Flex>
    </Stack>
  );
}
