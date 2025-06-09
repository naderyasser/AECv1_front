import {
  Button,
  Divider,
  Heading,
  Skeleton,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { InputElement } from "../../../../../../../../../Components/Common/Index";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { ErrorText } from "../../../../../../../../../Components/Common/ErrorText/ErrorText";
import { Admin } from "../../../../../../../../../$Models/Admin";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useFetch } from "../../../../../../../../../Hooks/Index";

const schema = z.object({
  title: z
    .string({ message: "Title Required" })
    .min(3, { message: "Title At Least Must Be 3 Characters" }),
  description: z
    .string({ message: "Description Required" })
    .min(3, { message: "Description At Least Must Be 3 Characters" }),
  // is_done: z.boolean({ message: "please choose if section is Done Or Not" }),
});

export default function Index() {
  const { sectionId, id } = useParams();
  const { data, loading } = useFetch({
    endpoint: `/sections/${sectionId}/`,
  });
  const { HandleRender } = useOutletContext();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset(data);
  }, [JSON.stringify(data)]);

  const onSubmit = async (data) => {
    const Section_Init = new Admin.Section({ ...data, course: id });
    const { data: SectionResponce, error } = await Section_Init.Update({
      id: sectionId,
    });
    if (error) {
      toast({
        title: "Error In Updaing Section",
        status: "error",
      });
      return;
    }
    toast({
      title: "Section Updated Successfully",
      status: "success",
    });

    // Refresh the parent data after successful update
    if (HandleRender) {
      await HandleRender();
    }

    Navigate(`/courses/${id}/sections`);
  };

  return (
    <Stack as={Skeleton} isLoaded={!loading} gap="4" p="3">
      <Heading size="md">Update A Section</Heading>
      <Divider />
      <InputElement
        register={register}
        name="title"
        errors={errors}
        size="lg"
        placeholder="title"
      />
      <InputElement
        register={register}
        name="description"
        errors={errors}
        size="lg"
        placeholder="description"
        as={Textarea}
      />
      {/* <Checkbox
        {...register("is_done")}
        bgColor="gray.50"
        borderRadius="lg"
        p="3"
        alignItems="center"
        size="lg"
        border="1px"
        borderColor="gray.300"
      >
        <Text>is Done</Text>
      </Checkbox>
      <ErrorText>{errors?.is_done?.message}</ErrorText> */}
      <Button
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
        colorScheme="blue"
      >
        Update The Course
      </Button>
    </Stack>
  );
}
