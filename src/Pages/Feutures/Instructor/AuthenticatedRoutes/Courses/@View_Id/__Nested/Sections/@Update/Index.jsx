import {
  Button,
  Divider,
  Heading,
  Stack,
  Textarea,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputElement } from "../../../../../../../../../Components/Common/InputElement/InputElement";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Instructor } from "../../../../../../../../../$Models/Instructor";
import { MdOutlineSubtitles } from "react-icons/md";
import { useFetch } from "../../../../../../../../../Hooks/Index";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function Index() {
  const { id: courseId, sectionId } = useParams();
  const Navigate = useNavigate();
  const { HandleRender } = useOutletContext() || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const {
    data: sectionData,
    loading,
    error,
  } = useFetch({
    endpoint: `sections/${sectionId}/`,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  // Set initial form values when data is loaded
  useEffect(() => {
    if (sectionData) {
      reset({
        title: sectionData.title || "",
        description: sectionData.description || "",
      });
    }
  }, [sectionData, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const section = new Instructor.Section({
        id: sectionId,
        title: data.title,
        description: data.description,
        course: courseId,
      });

      const { error } = await section.Update({ id: sectionId });

      if (error) {
        console.log("🚀 ~ onSubmit ~ error:", error);
        toast({
          title: "Error updating section",
          description:
            error.message || "There was an error updating the section",
          status: "error",
        });
        return;
      }

      toast({
        title: "Section updated",
        description: "The section has been successfully updated",
        status: "success",
      });

      // Refresh parent data
      if (HandleRender) {
        await HandleRender();
      }

      // Navigate back to sections list
      Navigate(`/courses/${courseId}/sections`);
    } catch (err) {
      console.log("🚀 ~ onSubmit ~ err:", err);
      toast({
        title: "Error updating section",
        description: err.message || "There was an unexpected error",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Stack spacing={4}>
        <Heading size="md">Error</Heading>
        <Button onClick={() => window.location.reload()} colorScheme="blue">
          Try Again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={6} maxW="800px" mx="auto">
      <Heading size="md">Update Section</Heading>
      <Divider />

      <Skeleton isLoaded={!loading}>
        <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
          <InputElement
            Icon={MdOutlineSubtitles}
            placeholder="Section Title"
            register={register}
            name="title"
            errors={errors}
            size="lg"
          />

          <InputElement
            size="lg"
            Icon={MdOutlineSubtitles}
            placeholder="Section Description"
            register={register}
            as={Textarea}
            name="description"
            errors={errors}
          />

          <Button
            size="lg"
            isLoading={isSubmitting}
            colorScheme="blue"
            type="submit"
            mt={2}
          >
            Update Section
          </Button>
        </Stack>
      </Skeleton>
    </Stack>
  );
}
