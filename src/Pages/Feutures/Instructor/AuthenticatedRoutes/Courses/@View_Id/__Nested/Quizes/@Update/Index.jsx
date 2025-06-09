import {
  Button,
  Divider,
  Heading,
  Select,
  Stack,
  Text,
  Flex,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { InputElement } from "../../../../../../../../../Components/Common/Index";
import { Controller, useForm } from "react-hook-form";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ChakraDatePicker } from "../../../../../../../../../Components/Common/ChakraDatePicker/ChakraDatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { ErrorText } from "../../../../../../../../../Components/Common/ErrorText/ErrorText";
import { Instructor } from "../../../../../../../../../$Models/Instructor";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { quizId, id } = useParams();
  const { data, loading } = useFetch({
    endpoint: `/assignments/${quizId}/`,
  });
  const { data: courseData, loading: courseLoading } = useOutletContext();

  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: {
      section: "",
      title: "",
      type: "",
      timer: "",
      unlocks_at: "",
      time_tracker: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        type: data.type?.id || data.type,
        unlocks_at: new Date(data.unlocks_at).toLocaleString(),
        time_tracker: new Date(data.time_tracker).toLocaleString(),
      });
    }
  }, [data, reset]);

  const section = watch("section");

  const { loading: quizTypeLoading, data: quizTypes } = useFetch({
    endpoint: "assignment-types",
  });

  const onSubmit = async (formData) => {
    try {
      const assignment_init = new Instructor.Assignment({
        ...formData,
        id: quizId,
        order_id: data?.order_id || 1,
        course: id,
        section: section,
        unlocks_at: new Date(formData.unlocks_at).toISOString(),
        time_tracker: new Date(formData.time_tracker).toISOString(),
      });

      const { error } = await assignment_init.Update(quizId);

      if (error) {
        console.error("Update error:", error);
        toast({
          title: "Error Updating Quiz",
          description: error.message || "Something went wrong",
          status: "error",
        });
        return;
      }

      toast({
        title: "Quiz Updated Successfully",
        description: "Your changes have been saved",
        status: "success",
      });

      setTimeout(() => {
        navigate(`/courses/${id}/quizes`);
      }, 1000);
    } catch (err) {
      console.error("Exception during update:", err);
      toast({
        title: "Error Updating Quiz",
        description: err.message || "An unexpected error occurred",
        status: "error",
      });
    }
  };

  return (
    <Stack
      as={Skeleton}
      isLoaded={!loading}
      gap="4"
      bgColor="gray.50"
      borderRadius="lg"
      p="4"
    >
      <Heading size="md">Update Quiz</Heading>
      <Divider />

      <Skeleton isLoaded={!courseLoading}>
        <InputElement
          as={Select}
          placeholder="Select a section for this quiz"
          name="section"
          register={register}
          size="lg"
          heightAlignedCenter
          errors={errors}
          defaultValue={data?.section}
          onChange={(e) => {
            setValue("section", e.target.value);
          }}
          required
        >
          {courseData?.sections?.map((item) => (
            <option
              value={item.id}
              key={item.id}
              selected={item.id === data?.section}
            >
              {item.title}
            </option>
          ))}
        </InputElement>
      </Skeleton>

      <InputElement
        register={register}
        name="title"
        errors={errors}
        size="lg"
        placeholder="Quiz title"
      />

      <Skeleton isLoaded={!quizTypeLoading}>
        <InputElement
          as={Select}
          placeholder="Quiz type"
          name="type"
          register={register}
          Icon={FaRegNoteSticky}
          size="lg"
          heightAlignedCenter
          errors={errors}
          defaultValue={data?.type?.id || data?.type}
        >
          {quizTypes?.map((item) => (
            <option
              value={item.id}
              key={item.id}
              selected={item.id === (data?.type?.id || data?.type)}
            >
              {item.name}
            </option>
          ))}
        </InputElement>
      </Skeleton>

      <Flex alignItems="start" gap="3">
        <InputElement
          register={register}
          name="timer"
          errors={errors}
          size="lg"
          placeholder="Timer in minutes"
          Icon={FaClock}
          type="number"
        />
        <Button
          size="lg"
          colorScheme="blue"
          onClick={() => setValue("timer", 15)}
        >
          Default (15m)
        </Button>
      </Flex>

      <Controller
        name="unlocks_at"
        control={control}
        render={({ field }) => (
          <>
            <ChakraDatePicker
              size="lg"
              variant="filled"
              placeholder="When should this quiz unlock for students?"
              onChange={(date) =>
                field.onChange(new Date(date).toLocaleString())
              }
              minDate={Date.now()}
              value={field.value ? new Date(field.value) : null}
            />
            <ErrorText>{errors?.unlocks_at?.message}</ErrorText>
          </>
        )}
      />

      <Controller
        name="time_tracker"
        control={control}
        render={({ field }) => (
          <>
            <ChakraDatePicker
              size="lg"
              variant="filled"
              placeholder="Quiz time track date"
              onChange={(date) =>
                field.onChange(new Date(date).toLocaleString())
              }
              minDate={Date.now()}
              value={field.value ? new Date(field.value) : null}
            />
            <ErrorText>{errors?.time_tracker?.message}</ErrorText>
          </>
        )}
      />

      <Flex gap="3" mt="3">
        <Button
          onClick={() => navigate(`/courses/${id}/quizes/${quizId}`)}
          variant="outline"
          size="lg"
          flexGrow="1"
        >
          Cancel
        </Button>
        <Button
          isLoading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          size="lg"
          flexGrow="1"
        >
          Update Quiz
        </Button>
      </Flex>

      <Text fontSize="xs" color="gray.500" mt={1}>
        Quiz ID: {quizId}
      </Text>
    </Stack>
  );
}
