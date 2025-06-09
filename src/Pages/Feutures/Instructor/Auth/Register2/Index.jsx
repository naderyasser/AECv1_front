import { Button, Flex, Stack, useToast } from "@chakra-ui/react";
import { useMultipleFormSteps } from "../../../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { UserInformation } from "./Steps/Userinformation/UserInformation";
import { FormWrapper } from "../FormWrapper/FormWrapper";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { schema } from "./schema";
import { ProgressBar } from "../../../../../Components/Common/ProgressBar/ProgressBar";
import { UserImage } from "./Steps/UserImage/UserImage";
import { UserPassword } from "./Steps/UserPassword/UserPassword";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../../../../Components/Common/Logo/Logo";
import { Category } from "./Steps/Category/Category";
import { Nationality } from "./Steps/Nationality/Nationality";
import { Experiance } from "./Steps/Experiance/Experiance";
import { Location } from "./Steps/Location/Location";
import { UserAgeGender } from "./Steps/UserAge&Gender/UserAge&Gender";
import { BaseNavigationHandler } from "../../../../../Utils/BaseNavigationHandler/BaseNavigationHandler";
import { useState } from "react";
import { useAuth } from "../../../../../Context/UserDataProvider/UserDataProvider";
import { ErrorBoundary } from "../../../../../Components/Common/ErrorBoundary/ErrorBoundary";
import { Instructor } from "../../../../../$Models/Instructor";
import { StudentRegisterModal } from "./StudentRegisterModal";
import { switchUserRole } from "../../../../../Utils/RoleSwitcher/RoleSwitcher";

const Steps = ({ isSignedIn } = {}) => {
  const arr = [
    {
      Component: UserInformation,
      fieldsRequired: [
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "phone",
      ],
    },
    {
      Component: Category,
      fieldsRequired: ["category", "subCategory"],
    },
    {
      Component: Nationality,
      fieldsRequired: ["nationality"],
    },
    {
      Component: Experiance,
      fieldsRequired: ["degree", "cv", "certificate"],
    },
    {
      Component: UserImage,
    },
    {
      Component: Location,
      fieldsRequired: ["place"],
    },
    {
      Component: UserAgeGender,
      fieldsRequired: ["age"],
    },
    {
      Component: UserPassword,
      fieldsRequired: ["password", "confirmPassword"],
    },
  ];

  return arr;
};

const ErrorPageWrapper = (errorKey) => {
  const arr = [
    ["first_name", "middle_name", "last_name", "email", "phone"],
    ["category", "subCategory"],
    ["nationality"],
    ["degree", "cv", "certificate"],
    ["place"],
    ["age"],
    ["password", "confirmPassword"],
  ];
  const index = arr.findIndex((item) => {
    return item.includes(errorKey);
  });
  if (index !== -1) {
    return index;
  } else {
    return Steps().length - 1;
  }
};

export default function Index() {
  const Navigate = useNavigate();
  const { onAuth, user } = useAuth();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    formState: { errors, isSubmitting, isValidating, isLoading },
    register,
    HandleNext,
    HandlePrev,
    isLastStep,
    isFirstStep,
    handleSubmit,
    CurrentStep,
    currentStepIndex,
    control,
    setValue,
    wrapperTransionStyles,
    watch,
    setError,
    HandleChangeCurrentStepIndex,
  } = useMultipleFormSteps({
    steps: Steps({
      isSignedIn: user.data ? true : false,
    }),
    schema: schema({ isSignedIn: user.data }),
    mode: "onBlur",
    defaultValues: {
      ...user?.data,
      subCategory: user?.data?.sub_category,
    },
  });

  const onSubmit = async (data) => {
    setIsCreatingAccount(true);
    try {
      // Show processing toast
      const processingToastId = toast({
        title: "Processing Application",
        description: "Your instructor application is being submitted...",
        status: "info",
        duration: null,
        isClosable: false,
      });

      const { error, ApplicationResponse } =
        await Instructor.CreateInstructorAccount(
          data,
          {
            errors: {
              errorHandler: (error) => {
                if (error.error) {
                  const ErrorData = error.error?.originalError?.response?.data;
                  for (let key in ErrorData) {
                    setError(key, {
                      message: ErrorData[key].join(`\n`),
                    });
                    HandleChangeCurrentStepIndex(ErrorPageWrapper(key));

                    for (let error of ErrorData[key]) {
                      toast({
                        title: "Error",
                        status: "error",
                        description: error,
                      });
                    }
                  }
                  return;
                }
              },
            },
          },
          {
            isSignedIn: user.data ? true : false,
            onAuth,
          }
        );

      // Close the processing toast
      toast.close(processingToastId);

      if (error) {
        toast({
          title: "Registration Failed",
          description:
            "There was an error processing your application. Please try again.",
          status: "error",
          duration: 5000,
        });
        return;
      }

      // Update user object in localStorage to set is_send_application: true
      try {
        const userDataString = localStorage.getItem("User");
        if (userDataString) {
          const userData = JSON.parse(userDataString);

          // Update the data property with is_send_application = true
          if (userData) {
            const updatedUserData = {
              ...userData,
              is_send_application: true,
            };

            // Save back to localStorage
            localStorage.setItem("User", JSON.stringify(updatedUserData));
          }
        }
      } catch (storageError) {
        console.error("Error updating localStorage:", storageError);
      }

      // Show success toast
      toast({
        title: "Application Submitted Successfully!",
        description:
          "Your instructor application has been received. We'll review it shortly.",
        status: "success",
        duration: 5000,
      });

      // Navigate to application status page to show the user their application status
      setTimeout(() => {
        Navigate(`/application-status/${ApplicationResponse?.data?.status}`);
      }, 1500);
    } catch (err) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
      });
      console.error("Registration error:", err);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  if (!user.data && !user.loading) {
    return (
      <FormWrapper>
        <StudentRegisterModal isOpen={true} />;
      </FormWrapper>
    );
  }

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
          steps={Steps().length}
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
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Logo w="100px" mb="3" onClick={() => BaseNavigationHandler("/")} />
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={() => switchUserRole("student", true)}
          >
            Go Back to Student
          </Button>
        </Flex>

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
          <ErrorBoundary>
            <CurrentStep
              isSignedIn={user.data ? true : false}
              errors={errors}
              currentStepIndex={currentStepIndex}
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
            />
          </ErrorBoundary>
        </motion.div>

        <Flex w="100%" justifyContent="start" gap="3">
          <Button
            isDisabled={isFirstStep || isCreatingAccount}
            onClick={HandlePrev}
            gap="3"
            colorScheme="blue"
            variant="outline"
          >
            <FaArrowLeft />
            Prev
          </Button>
          {isLastStep ? (
            <Button
              isLoading={isSubmitting || isCreatingAccount}
              onClick={handleSubmit(onSubmit)}
              gap="3"
              colorScheme="green"
              loadingText="Creating Account..."
            >
              Create Instructor Account
            </Button>
          ) : (
            <Button
              isLoading={isValidating}
              onClick={HandleNext}
              gap="3"
              colorScheme="blue"
              isDisabled={isCreatingAccount}
            >
              Next
              <FaArrowRight />
            </Button>
          )}
        </Flex>
        <Button
          mr="auto"
          ml="1"
          variant="link"
          as={Link}
          to="/login"
          isDisabled={isCreatingAccount}
        >
          Have An Account Already? Please Click Here To Sign In
        </Button>
      </Stack>
    </FormWrapper>
  );
}
