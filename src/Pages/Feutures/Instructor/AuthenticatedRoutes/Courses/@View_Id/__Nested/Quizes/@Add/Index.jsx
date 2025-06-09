import {
  Button,
  Checkbox,
  Divider,
  Heading,
  Select,
  Stack,
  Textarea,
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

export default function Index() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { data, loading } = useOutletContext();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: {
      section: "",
    },
  });

  const section = watch("section");

  const {
    loading: assignmentTypeLoading,
    error: assignmentTypesError,
    data: assignmentTypes,
  } = useFetch({
    endpoint: "assignment-types",
  });

  const onSubmit = async (data) => {
    try {
      const assignment_init = new Instructor.Assignment({
        ...data,
        order_id: 1,
        course: id,
        section: section,
        unlocks_at: new Date(data.unlocks_at).toISOString(),
        time_tracker: new Date(data.time_tracker).toISOString(),
      });

      const { data: response, error } = await assignment_init.Add();

      if (error) {
        console.log("🚀 ~ onSubmit ~ error:", error);
        toast({
          title: "Error Creating Quiz",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Quiz Created Successfully",
        description: "Your new quiz has been added to the course",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to the quizzes list
      navigate(`/courses/${id}/quizes`);
    } catch (err) {
      console.log("🚀 ~ onSubmit ~ err:", err);
      toast({
        title: "Error Creating Quiz",
        description: err.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack gap="4" bgColor="gray.50" borderRadius="lg" p="4">
      <Heading size="md">Create New Quiz</Heading>
      <Divider />

      <Skeleton isLoaded={!loading}>
        <InputElement
          as={Select}
          placeholder="Select a section for this quiz"
          name="section"
          register={register}
          size="lg"
          heightAlignedCenter
          errors={errors}
          onChange={(e) => {
            setValue("section", e.target.value);
          }}
          required
        >
          {data?.sections?.map((item) => (
            <option value={item.id} key={item.id}>
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

      <Skeleton isLoaded={!assignmentTypeLoading}>
        <InputElement
          as={Select}
          placeholder="Quiz type"
          name="type"
          register={register}
          Icon={FaRegNoteSticky}
          size="lg"
          heightAlignedCenter
          errors={errors}
        >
          {assignmentTypes?.map((item) => (
            <option value={item.id} key={item.id}>
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
            />
            <ErrorText>{errors?.time_tracker?.message}</ErrorText>
          </>
        )}
      />

      <Flex gap="3" mt="2">
        <Button
          onClick={() => navigate(`/courses/${id}/quizes`)}
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
          Create Quiz
        </Button>
      </Flex>
    </Stack>
  );
}
