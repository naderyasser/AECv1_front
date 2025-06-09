import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { MdPhone } from "react-icons/md";
import { ErrorText } from "../../../../../../../Components/Common/ErrorText/ErrorText";
import { PhoneInput } from "../../../../../../../Components/Common/PhoneNumberInput/PhoneNumberInput";
import { Controller } from "react-hook-form";

export const UserInformation = ({ register, errors, control }) => {
  return (
    <>
      <Input
        {...register("first_name")}
        placeholder="first name"
        isInvalid={errors.first_name}
        _placeholder={{
          color: errors.first_name && "red.500",
        }}
      />
      <ErrorText mr="auto" ml="1">
        {errors.first_name?.message}
      </ErrorText>

      <Input
        {...register("middle_name")}
        placeholder="middle name"
        isInvalid={errors.middle_name}
        _placeholder={{
          color: errors.middle_name && "red.500",
        }}
      />
      <ErrorText mr="auto" ml="1">
        {errors.middle_name?.message}
      </ErrorText>

      <Input
        {...register("last_name")}
        placeholder="last name"
        isInvalid={errors.last_name}
        _placeholder={{
          color: errors.last_name && "red.500",
        }}
      />
      <ErrorText mr="auto" ml="1">
        {errors.last_name?.message}
      </ErrorText>

      <Input
        {...register("email")}
        placeholder="email"
        isInvalid={errors.email}
        _placeholder={{
          color: errors.email && "red.500",
        }}
      />
      <ErrorText mr="auto" ml="1">
        {errors.email?.message}
      </ErrorText>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => {
          return (
            <PhoneInput
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          );
        }}
      />

      <ErrorText mr="auto" ml="1">
        {errors.phone?.message}
      </ErrorText>
    </>
  );
};
