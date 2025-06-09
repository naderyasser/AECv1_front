import {
  Button,
  Divider,
  Heading,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputElement } from "../../../../../../../../../Components/Common/InputElement/InputElement";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Instructor } from "../../../../../../../../../$Models/Instructor";
import { MdOutlineSubtitles } from "react-icons/md";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function Index() {
  const { id: courseId } = useParams();
  const Navigate = useNavigate();
  const { HandleRender } = useOutletContext() || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const section = new Instructor.Section({
        title: data.title,
        description: data.description,
        course: courseId,
      });

      const { error } = await section.Add();

      if (error) {
        toast({
          title: "Error creating section",
          description:
            error.message || "There was an error creating the section",
          status: "error",
        });
        return;
      }

      toast({
        title: "Section created",
        description: "The section has been successfully created",
        status: "success",
      });

      // Refresh parent data
      if (HandleRender) {
        await HandleRender();
      }

      // Navigate back to sections list
      Navigate(`/courses/${courseId}/sections`);
    } catch (err) {
      toast({
        title: "Error creating section",
        description: err.message || "There was an unexpected error",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={6} maxW="800px" mx="auto">
      <Heading size="md">Add New Section</Heading>
      <Divider />

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
          Create Section
        </Button>
      </Stack>
    </Stack>
  );
}
