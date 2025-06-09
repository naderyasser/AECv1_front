import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Divider,
  Heading,
  Select,
  Skeleton,
  Stack,
  Textarea,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { InputElement } from "../../../../../../Components/Common/Index";
import { MdStar } from "react-icons/md";
import { CiDollar } from "react-icons/ci";
import { FaPuzzlePiece, FaUpload, FaFileAlt } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { LanguageSelect } from "../../../../../../Components/Common/LanguageSelect/LanguageSelect";
import { Levels } from "../../../../../../~Data/Levels";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { ImageUploader } from "../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
import { Admin } from "../../../../../../$Models/Admin";
import { useAuth } from "../../../../../../Context/UserDataProvider/UserDataProvider";
import { UploadProgressModal } from "../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";

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

const Index = () => {
  const { id } = useParams();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const Navigate = useNavigate();
  const { user } = useAuth();
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [formReady, setFormReady] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [courseFiles, setCourseFiles] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useFetch({
    endpoint: `/courses/course-details/${id}/`,
  });

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
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

  useEffect(() => {
    if (courseData && !courseLoading && Categories && SubCategories) {
      // Wait for both course data AND category data to be available
      reset({
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        category: courseData.category?.id || "", // Make sure we're passing the ID
        subCategory: courseData.sub_category?.id || "", // Make sure we're passing the ID
        level: courseData.level?.toUpperCase() || "", // Make sure case matches the options
        language: courseData.language,
        image: courseData.image,
      });

      // Initialize course files separately from form
      setCourseFiles(
        courseData.course_attachment
          ? courseData.course_attachment.map((file) => ({
              id: file.id,
              title: file.title,
              type: file.type,
              url: file.url,
            }))
          : []
      );

      setFormReady(true);
    }
  }, [courseData, courseLoading, Categories, SubCategories, reset]);

  const handleUploadProgress = (progress) => {
    setUploadingPercent(progress);
  };

  const handleRemoveAttachment = (fileId) => {
    setRemovedAttachments((prev) => [...prev, fileId]);
    setCourseFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  const onSubmit = async (data) => {
    try {
      const courseName =
        data.image instanceof File ? data.image.name : "Course image";
      setUploadingFile(courseName);

      const course_init = new Admin.Course({
        ...data,
        level: data.level.toLowerCase(),
        courseFiles,
        userId: user.data?.id,
        id: id,
        removedAttachments: removedAttachments,
      });

      const { data: CourseResponse, error } = await course_init.Update(
        handleUploadProgress
      );

      if (error) {
        toast({
          title: "Error in Updating Course",
          status: "error",
        });
        console.log(error);
        return;
      }

      toast({
        title: "Course updated successfully",
        status: "success",
      });

      Navigate("/courses");
    } finally {
      setUploadingPercent(0);
      setUploadingFile(null);
    }
  };

  if (courseLoading) {
    return (
      <Stack p="5" spacing={4}>
        <Skeleton height="40px" />
        <Skeleton height="300px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
      </Stack>
    );
  }

  if (courseError) {
    return (
      <Stack p="5">
        <Text color="red.500">Error loading course: {courseError.message}</Text>
        <Button onClick={() => Navigate("/courses")}>Back to Courses</Button>
      </Stack>
    );
  }

  return (
    <Stack p="5" minH="100vh" w="100%">
      <UploadProgressModal
        isOpen={uploadingPercent > 0}
        uploadProgress={uploadingPercent}
        fileName={uploadingFile || "Course file"}
        fileSize={getValues()?.image?.size}
      />
      <Heading mb="2" size="md">
        Update Course
      </Heading>
      <Divider />
      <Controller
        control={control}
        name="image"
        render={({ field }) => {
          return (
            <>
              <ImageUploader
                img={field.value instanceof File ? field.value : undefined}
                currentImageUrl={
                  imageRemoved
                    ? null
                    : typeof field.value === "string"
                    ? field.value
                    : courseData?.image
                }
                onChangeImage={(file) => {
                  field.onChange(file);
                  setImageRemoved(false); // Reset removed state when new image is selected
                }}
                onRemoveImage={() => {
                  field.onChange(null);
                  setImageRemoved(true); // Mark image as explicitly removed
                }}
                isInvalid={errors.image}
                label={
                  <Stack p="4" alignItems="center">
                    <FaUpload />
                    {!errors?.image && <Text>Update Course Image</Text>}
                    {courseData?.image &&
                      !imageRemoved &&
                      !(field.value instanceof File) && (
                        <Box>
                          <Text fontSize="sm">
                            Current image will be kept if none selected
                          </Text>
                          <img
                            src={courseData.image}
                            alt="Current"
                            style={{ maxHeight: "100px", marginTop: "10px" }}
                          />
                        </Box>
                      )}
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
        defaultValue={courseData?.level?.toUpperCase()} // Add defaultValue here
      >
        {Levels.map((level) => {
          return (
            <option key={level.title} value={level.title.toUpperCase()}>
              {level.title.toUpperCase()}
            </option>
          );
        })}
      </InputElement>

      <LanguageSelect
        error={errors.language?.message}
        control={control}
        name="language"
        defaultValue={courseData?.language}
      />

      <Box
        border="1px dashed"
        borderColor={false ? "red.500" : "gray.300"}
        borderRadius="md"
        p={4}
      >
        <FileUploader
          files={courseFiles.filter((file) => file instanceof File)}
          onChange={(files) => {
            // Preserve existing files with their complete structure
            const existingFiles = courseFiles
              .filter((file) => !(file instanceof File))
              .map((file) => ({
                id: file.id,
                title: file.title,
                type: file.type,
                url: file.url,
              }));

            setCourseFiles([...existingFiles, ...files]);
          }}
          isInvalid={false}
          errorMessage=""
        />
      </Box>

      {courseData?.course_attachment &&
        courseData.course_attachment.length > 0 &&
        courseData.course_attachment.length !== removedAttachments.length && (
          <Box mt={2} p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              Current Course Files:
            </Text>
            <Stack>
              {courseData.course_attachment
                .filter((file) => !removedAttachments.includes(file.id))
                .map((file, index) => (
                  <Box
                    key={file.id || index}
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text>{file.title || `File ${index + 1}`}</Text>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Text fontSize="xs" color="gray.500">
                        Already uploaded
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveAttachment(file.id)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))}
            </Stack>
            <Text fontSize="sm" color="gray.600" mt={2}>
              *Uploading new files will replace the current ones
            </Text>
          </Box>
        )}

      <Button
        isLoading={isSubmitting || uploadingPercent > 0}
        onClick={handleSubmit(onSubmit)}
        size="lg"
        colorScheme="blue"
      >
        Update Course
      </Button>
    </Stack>
  );
};

export default Index;
