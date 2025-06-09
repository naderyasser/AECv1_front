import { PasswordInput } from "../../../../../../../Components/Common/PasswordInput/PasswordInput";
import { ErrorText } from "../../../../../../../Components/Common/ErrorText/ErrorText";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { Divider, Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { checkPasswordComplexity } from "../../../../../../../Utils/CheckPasswordComplexity/CheckPasswordComplexity";
import { useWatch } from "react-hook-form";
import { CenteredTextWithLines } from "../../../../../../../Components/Common/Index";
export const UserPassword = ({ register, errors, control, isSignedIn }) => {
  const Password = useWatch({ control, name: "password" });
  const PasswordComplexity = useMemo(
    () => checkPasswordComplexity(Password || ""),
    [Password]
  );
  return (
    <>
      {isSignedIn && (
        <>
          <CenteredTextWithLines m="0 auto" w="100%" maxW="300px">
            <Heading flexShrink="0" textAlign="center" size="md">
              Verification
            </Heading>
          </CenteredTextWithLines>
          <Text textAlign="center">
            Please rewrite your password to make sure its your account
          </Text>
          <Divider />
        </>
      )}

      <Stack gap="0">
        <PasswordInput
          {...register("password")}
          Icon={FaUnlockKeyhole}
          placeholder="Password"
          varient="filled"
          size="lg"
          errors={errors}
        />
        {!Password && <ErrorText my="2">{errors?.password?.message}</ErrorText>}
        {!isSignedIn && (
          <>
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
          </>
        )}
      </Stack>
    </>
  );
};
