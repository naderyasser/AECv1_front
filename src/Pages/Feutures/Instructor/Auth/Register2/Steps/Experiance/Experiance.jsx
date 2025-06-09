import { InputElement } from "../../../../../../../Components/Common/Index";
import { PiCertificateThin } from "react-icons/pi";
import { FileUploadBox } from "../../../../../../../Components/Common/FileUploadBox/FileUploadBox";
import { Box, Text, VStack } from "@chakra-ui/react";

export const Experiance = ({ errors, watch, register, setValue }) => {
  return (
    <VStack spacing={4} align="stretch" overflowY="auto" maxH="400px">
      <Text fontSize="lg" fontWeight="semibold" color="gray.700">
        Experience & Qualifications
      </Text>
      <InputElement
        placeholder="University Degree"
        errors={errors}
        Icon={PiCertificateThin}
        register={register}
        name="degree"
      />
      <FileUploadBox
        label="CV"
        description="Upload your latest CV/Resume. Please include your educational background, work experience, and relevant skills. Accepted formats: PDF, JPG, JPEG, PNG (max 5MB)."
        accept=".pdf,.jpg,.jpeg,.png"
        register={register}
        name="cv"
        error={errors.cv}
        watch={watch}
        setValue={setValue}
      />{" "}
      <FileUploadBox
        label="Certificates"
        description="Upload all your teaching certificates, professional certifications, and relevant qualifications in a single PDF file. If you have multiple certificates, please combine them into one PDF document. This helps verify your expertise in your subject area. Accepted formats: PDF preferred, or JPG, JPEG, PNG (max 5MB)."
        accept=".pdf,.jpg,.jpeg,.png"
        register={register}
        name="certificate"
        error={errors.certificate}
        watch={watch}
        setValue={setValue}
      />
    </VStack>
  );
};
