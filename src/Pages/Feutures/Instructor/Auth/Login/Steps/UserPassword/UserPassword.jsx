import {
  FormControl,
  FormErrorMessage,
  Heading,
  Checkbox,
  Flex,
  Button,
  Text,
} from "@chakra-ui/react";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { PasswordInput } from "../../../../../../../Components/Common/PasswordInput/PasswordInput";

export const UserPassword = ({ register, errors }) => {
  return (
    <>
      <Heading size="lg" textAlign="center">
        Enter Your Password
      </Heading>
      <Text textAlign="center" color="gray.600" mb={4}>
        Please enter your password to access your account
      </Text>
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
      <Flex gap="4" w="100%" alignItems="center" justifyContent="space-between">
        <Checkbox {...register("rememberMe")} color="gray.600">
          Remember Me
        </Checkbox>
        <Button variant="link" size="sm">
          Forgot Password?
        </Button>
      </Flex>
    </>
  );
};
