import { PasswordInput } from "../../../../../../../Components/Common/PasswordInput/PasswordInput";
import { ErrorText } from "../../../../../../../Components/Common/ErrorText/ErrorText";
export const UserPassword = ({ register, errors }) => {
  return (
    <>
      <PasswordInput
        placeholder="password"
        {...register("password")}
        isInvalid={errors.password}
      />
      <ErrorText mr="auto" ml="1">
        {errors.password?.message}
      </ErrorText>
    </>
  );
};
