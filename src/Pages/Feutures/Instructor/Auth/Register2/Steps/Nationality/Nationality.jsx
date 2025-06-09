import React from "react";
import { NationalityInput } from "../../../../../../../Components/Common/NationalityInput/NationalityInput";
import { Controller } from "react-hook-form";
import { ErrorText } from "../../../../../../../Components/Common/ErrorText/ErrorText";

export const Nationality = ({ control, errors }) => {
  return (
    <Controller
      control={control}
      name="nationality"
      render={({ field }) => (
        <>
          <NationalityInput
            value={field.value}
            onChange={(value) => field.onChange(value)}
          />
          <ErrorText>{errors?.nationality?.message}</ErrorText>
        </>
      )}
    />
  );
};
