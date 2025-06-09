import { FormWrapper } from "../FormWrapper/FormWrapper";
import { Button, Flex, Stack, useToast } from "@chakra-ui/react";
import { ProgressBar } from "../../../../../Components/Common/ProgressBar/ProgressBar";
import { useMultipleFormSteps } from "../../../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { schema } from "./schema";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserEmail } from "./Steps/UserEmail/UserEmail";
import { UserPassword } from "./Steps/UserPassword/UserPassword";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";
import { Logo } from "../../../../../Components/Common/Logo/Logo";
import { Admin } from "../../../../../$Models/Admin";

const Steps = [
  {
    Component: UserEmail,
    fieldsRequired: ["email"],
  },
  {
    Component: UserPassword,
    fieldsRequired: ["password"],
  },
];

export default function Index() {
  const { onAuth } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
    containerStyle: {
      maxW: "300px",
    },
  });
  const {
    formState: { errors, isSubmitting, isValidating },
    register,
    HandleNext,
    HandlePrev,
    isLastStep,
    isFirstStep,
    CurrentStep,
    currentStepIndex,
    control,
    setValue,
    wrapperTransionStyles,
    handleSubmit,
    setError,
    HandleChangeCurrentStepIndex,
  } = useMultipleFormSteps({
    steps: Steps,
    schema: schema,
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    const { error, data: LoginResponce } = await Admin.Login({
      email: data.email,
      password: data.password,
    });
    if (error) {
      const ErrorData = error?.originalError?.response?.data.detail;
      toast({
        title: "error",
        status: "error",
        description: ErrorData,
      });
      setError("email", {
        message: ErrorData,
      });
      HandleChangeCurrentStepIndex(0);
      return;
    }
    toast({
      status: "success",
      title: "login successfully",
    });
    onAuth({ ...LoginResponce?.data, ...data }, "Admin");
  };
  return (
    <FormWrapper>
      <Stack
        alignItems="center"
        w="100%"
        maxW="600px"
        bgColor="white"
        p="3"
        borderRadius="lg"
      >
        <ProgressBar
          size="sm"
          steps={Steps.length}
          current={currentStepIndex + 1}
        />
      </Stack>

      <Stack
        justifyContent="center"
        alignItems="center"
        p="3"
        borderRadius="lg"
        bgColor="white"
        w="100%"
        maxW="600px"
        gap="4"
        overflow="hidden"
      >
        <Logo w="100px" />
        <motion.div
          style={{
            width: "100%",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
          }}
          {...wrapperTransionStyles}
          key={currentStepIndex}
        >
          <CurrentStep
            errors={errors}
            currentStepIndex={currentStepIndex}
            register={register}
            control={control}
            setValue={setValue}
          />
        </motion.div>

        <Flex w="100%" justifyContent="start" gap="3">
          <Button
            isDisabled={isFirstStep}
            onClick={HandlePrev}
            gap="3"
            variant="outline"
            colorScheme="blue"
          >
            <FaArrowLeft />
            Prev
          </Button>
          {isLastStep ? (
            <Button
              isLoading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              gap="3"
              colorScheme="blue"
            >
              Login
            </Button>
          ) : (
            <Button
              isLoading={isValidating}
              onClick={HandleNext}
              gap="3"
              colorScheme="blue"
            >
              Next
              <FaArrowRight />
            </Button>
          )}
        </Flex>
      </Stack>
    </FormWrapper>
  );
}
