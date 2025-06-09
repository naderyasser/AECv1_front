import React, { useState } from "react";
import {
  Button,
  Divider,
  Heading,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useToast,
  Select,
  Box,
} from "@chakra-ui/react";
import { InputElement } from "../../../../../../Components/Common/Index";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { ImageUploader } from "../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { FaPuzzlePiece, FaUpload, FaFileAlt } from "react-icons/fa";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
import { CiDollar } from "react-icons/ci";
import { MdStar } from "react-icons/md";
import { LanguageSelect } from "../../../../../../Components/Common/LanguageSelect/LanguageSelect";
import { Levels } from "../../../../../../~Data/Levels";
import { useAuth } from "../../../../../../Context/UserDataProvider/UserDataProvider";
import { useNavigate } from "react-router-dom";
import { UploadProgressModal } from "../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { Instructor } from "../../../../../../$Models/Instructor";

const FileUploader = ({ files = [], onChange, isInvalid, errorMessage }) => {
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  return (
    <Box
      border="1px dashed"
      borderColor={isInvalid ? "red.500" : "gray.300"}
      borderRadius="md"
      p={4}
    >
      <Stack spacing={3}>
        <Button
          onClick={() => fileInputRef.current.click()}
          leftIcon={<FaFileAlt />}
          size="md"
        >
          Attach Course Files
        </Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
        />

        {files.length > 0 && (
          <Box mt={2}>
            <Text fontWeight="bold" mb={2}>
              Selected Files:
            </Text>
            <Stack>
              {files.map((file, index) => (
                <Box
                  key={index}
                  p={2}
                  bg="gray.100"
                  borderRadius="md"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>
                    {getFileIcon(file.name)} {file.name} (
                    {(file.size / 1024).toFixed(2)} KB)
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {isInvalid && <ErrorText>{errorMessage}</ErrorText>}
      </Stack>
    </Box>
  );
};

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),
  level: z.string().min(1, "Level is required"),
  image: z.any().refine((file) => file instanceof File, {
    message: "Image is required",
  }),
  language: z.string().min(1, "Language is required"),
  courseFiles: z.array(z.any()).optional(),
});

export default function Index() {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const Navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      courseFiles: [],
    },
  });
  const {
    data: Categories,
    loading: CatogiriesLoading,
    error: CategoriesError,
  } = useFetch({
    endpoint: "categories",
  });
  const {
    data: SubCategories,
    loading: SubCatogiriesLoading,
    error: SubCategoriesError,
  } = useFetch({
    endpoint: "sub-categories",
  });
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null);

  const handleUploadProgress = (progress) => {
    setUploadingPercent(progress);
  };

  const onSubmit = async (data) => {
    try {
      const courseName = data.image?.name || "Course image";
      setUploadingFile(courseName);

      const course_init = new Instructor.Course({
        ...data,
        level: data.level.toLowerCase(),
        userId: user.data?.id,
      });
      const { data: CourseResponse, error } = await course_init.Add(
        handleUploadProgress
      );

      if (error) {
        toast({
          title: "Error in Creating Course",
          status: "error",
        });
        console.log(error);
        return;
      }

      toast({
        title: "Course created successfully",
        status: "success",
      });

      Navigate("/courses");
    } finally {
      setUploadingPercent(0);
      setUploadingFile(null);
    }
  };

  return (
    <Stack p="5" minH="100vh" w="100%">
      <UploadProgressModal
        isOpen={uploadingPercent > 0}
        uploadProgress={uploadingPercent}
        fileName={uploadingFile || "Course file"}
        fileSize={getValues()?.image?.size}
      />
      <Heading mb="2" size="md">
        Add A Course
      </Heading>
      <Divider />
      <Controller
        control={control}
        name="image"
        render={({ field }) => {
          return (
            <>
              <ImageUploader
                img={field.value}
                onChangeImage={(file) => field.onChange(file)}
                onRemoveImage={() => field.onChange()}
                isInvalid={errors.image}
                label={
                  <Stack p="4" alignItems="center">
                    <FaUpload />
                    {!errors?.image && <Text>Upload Course Image</Text>}

                    <ErrorText>{errors?.image?.message}</ErrorText>
                  </Stack>
                }
              />
            </>
          );
        }}
      />

      <InputElement
        name="title"
        register={register}
        errors={errors}
        placeholder="Title"
        size="lg"
      />
      <InputElement
        name="description"
        register={register}
        errors={errors}
        placeholder="Description"
        as={Textarea}
        size="lg"
      />
      <InputElement
        name="price"
        register={register}
        errors={errors}
        placeholder="Price"
        size="lg"
        type="number"
        Icon={CiDollar}
      />
      <Skeleton minH="50px" isLoaded={!CatogiriesLoading}>
        <InputElement
          register={register}
          name="category"
          as={Select}
          Icon={FaPuzzlePiece}
          placeholder="Category"
          size="lg"
          errors={errors}
          cursor="pointer"
        >
          {Categories?.map((category) => {
            return (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            );
          })}
        </InputElement>
      </Skeleton>
      <Skeleton minH="50px" isLoaded={!SubCatogiriesLoading}>
        <InputElement
          register={register}
          name="subCategory"
          as={Select}
          Icon={FaPuzzlePiece}
          placeholder="sub category"
          size="lg"
          errors={errors}
          cursor="pointer"
        >
          {SubCategories?.map((category) => {
            return (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            );
          })}
        </InputElement>
      </Skeleton>

      <InputElement
        name="level"
        register={register}
        errors={errors}
        cursor="pointer"
        Icon={MdStar}
        placeholder="Level"
        size="lg"
        as={Select}
      >
        {Levels.map((level) => {
          return <option key={level.title}>{level.title.toUpperCase()}</option>;
        })}
      </InputElement>

      <LanguageSelect
        error={errors.language?.message}
        control={control}
        name="language"
      />

      <Controller
        control={control}
        name="courseFiles"
        render={({ field }) => (
          <FileUploader
            files={field.value}
            onChange={(files) => field.onChange(files)}
            isInvalid={!!errors.courseFiles}
            errorMessage={errors.courseFiles?.message}
          />
        )}
      />

      <Button
        isLoading={isSubmitting || uploadingPercent > 0}
        onClick={handleSubmit(onSubmit)}
        size="lg"
        colorScheme="blue"
      >
        Add The Course
      </Button>
    </Stack>
  );
}
