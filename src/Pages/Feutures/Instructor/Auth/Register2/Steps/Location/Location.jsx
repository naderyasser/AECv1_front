import React from "react";
import { InputElement } from "../../../../../../../Components/Common/Index";
import { MdGpsFixed } from "react-icons/md";

export const Location = ({ errors, register }) => {
  return (
    <InputElement
      size="lg"
      name="place"
      Icon={MdGpsFixed}
      errors={errors}
      register={register}
      placeholder="Location Address"
    />
  );
};
