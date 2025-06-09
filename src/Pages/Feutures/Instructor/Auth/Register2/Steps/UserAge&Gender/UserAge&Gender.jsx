import React from "react";
import {
  CenteredTextWithLines,
  InputElement,
} from "../../../../../../../Components/Common/Index";
import { FaImagePortrait } from "react-icons/fa6";
import { GenderSelector } from "../../../../../../../Components/Common/GenderRadio/GenderRadio";
import { RadioGroup, Select, Text } from "@chakra-ui/react";
export const UserAgeGender = ({ errors, register }) => {
  return (
    <>
      <InputElement
        size="lg"
        name="age"
        Icon={FaImagePortrait}
        type="number"
        errors={errors}
        register={register}
        placeholder="Age"
      />
      <CenteredTextWithLines mt="4" TextAlign="left">
        <Text flexShrink="0">Please Choose Your Gender</Text>
      </CenteredTextWithLines>
      <Select {...register("sex")}>
        <option value="male">male</option>
        <option value="female">female</option>
      </Select>
    </>
  );
};
