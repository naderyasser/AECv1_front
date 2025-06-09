import { FormControl, FormErrorMessage, Heading, Text } from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { InputElement } from "../../../../../../../Components/Common/InputElement/InputElement";

export const UserEmail = ({ register, errors }) => {
  return (
    <>
      <Heading size="lg" textAlign="center">
        Welcome to{" "}
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
        </span>{" "}
        Instructor Portal
      </Heading>
      <Text textAlign="center" color="gray.600" mb={4}>
        Enter your email to continue to your instructor dashboard
      </Text>
      <FormControl isInvalid={!!errors.email}>
        <InputElement
          register={register}
          name="email"
          placeholder="Email Address"
          size="lg"
          Icon={MdEmail}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
};