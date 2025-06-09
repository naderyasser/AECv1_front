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
import { Admin } from "../../../../../../../../../$Models/Admin";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function Index() {
  const Navigate = useNavigate();
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
      // is_done: false,
      // is_exam: false,
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

  const { loading: AssigmentTypeLoading, data: AssigmentTypes } = useFetch({
    endpoint: "assignment-types",
  });

  const onSubmit = async (formData) => {
    try {
      const assignment_init = new Admin.Assigment({
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
          title: "Error in Updating Assignment",
          status: "error",
        });
        return;
      }

      toast({
        title: "Assignment Updated Successfully",
        status: "success",
      });

      setTimeout(() => {
        Navigate(`/courses/${id}/quizes`);
      }, 1000);
    } catch (err) {
      console.error("Exception during update:", err);
      toast({
        title: "Error in Updating Assignment",
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
      p="3"
    >
      <Heading size="md">Update Assignment</Heading>
      <Divider />
      <Skeleton isLoaded={!courseLoading}>
        <InputElement
          as={Select}
          placeholder="select a section"
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
          {courseData?.sections?.map((item) => {
            return (
              <option
                value={item.id}
                key={item?.id}
                selected={item.id === data?.section}
              >
                {item?.title}
              </option>
            );
          })}
        </InputElement>
      </Skeleton>

      <InputElement
        register={register}
        name="title"
        errors={errors}
        size="lg"
        placeholder="title"
      />
      <Skeleton isLoaded={!AssigmentTypeLoading}>
        <InputElement
          as={Select}
          placeholder="assignment type"
          name="type"
          register={register}
          Icon={FaRegNoteSticky}
          size="lg"
          heightAlignedCenter
          errors={errors}
          defaultValue={data?.type?.id || data?.type}
        >
          {AssigmentTypes?.map((item) => {
            return (
              <option
                value={item.id}
                key={item?.id}
                selected={item.id === (data?.type?.id || data?.type)}
              >
                {item?.name}
              </option>
            );
          })}
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
          Min
        </Button>
      </Flex>

      <Controller
        name="unlocks_at"
        control={control}
        render={({ field }) => {
          return (
            <>
              <ChakraDatePicker
                size="lg"
                variant="filled"
                placeholder="Choose Assigment Unlocks Date"
                onChange={(date) =>
                  field.onChange(new Date(date).toLocaleString())
                }
                minDate={Date.now()}
                value={field.value ? new Date(field.value) : null}
              />
              <ErrorText>{errors?.unlocks_at?.message}</ErrorText>
            </>
          );
        }}
      />

      <Controller
        name="time_tracker"
        control={control}
        render={({ field }) => {
          return (
            <>
              <ChakraDatePicker
                size="lg"
                variant="filled"
                placeholder="Time Tracker"
                onChange={(date) =>
                  field.onChange(new Date(date).toLocaleString())
                }
                minDate={Date.now()}
                value={field.value ? new Date(field.value) : null}
              />
              <ErrorText>{errors?.time_tracker?.message}</ErrorText>
            </>
          );
        }}
      />

      {/* <Checkbox
        {...register("is_done")}
        bgColor="gray.100"
        borderRadius="lg"
        p="3"
        alignItems="center"
        size="lg"
      >
        <Text>is Done</Text>
      </Checkbox>
      <Checkbox
        {...register("is_exam")}
        bgColor="gray.100"
        borderRadius="lg"
        p="3"
        alignItems="center"
        size="lg"
      >
        <Text>is Exam</Text>
      </Checkbox> */}

      <Button
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
        colorScheme="blue"
        mt={2}
      >
        Update Assignment
      </Button>

      <Text fontSize="xs" color="gray.500" mt={2}>
        Assignment ID: {quizId}
      </Text>
    </Stack>
  );
}
