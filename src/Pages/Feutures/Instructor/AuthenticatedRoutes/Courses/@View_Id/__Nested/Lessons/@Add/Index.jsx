import {
  Button,
  Divider,
  Heading,
  Stack,
  Textarea,
  useToast,
  Text,
  Checkbox,
  Skeleton,
  Select,
  Box,
  Input,
  FormControl,
  FormLabel,
  Flex,
  Switch,
  Card,
  CardBody,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { InputElement } from "../../../../../../../../../Components/Common/InputElement/InputElement";
import { MdOutlineSubtitles, MdHelpOutline } from "react-icons/md";
import { VideoUploader } from "../../../../../../../../../Components/Common/VideoUploader/VideoUploader";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonCreationSchema } from "./schema";
import { ErrorText } from "../../../../../../../../../Components/Common/ErrorText/ErrorText";
import axiosInstance from "../../../../../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import { UploadProgressModal } from "../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  FaClock,
  FaEye,
  FaUpload,
  FaSort,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import { ImageUploader } from "../../../../../../../../../@Firebase/Utils/Common/ImageUploader/ImageUploader";

// FileUploader component for lesson attachments
const FileUploader = ({ files = [], onChange, isInvalid, errorMessage }) => {
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        title: file.name, // Default title is the filename
        type: getFileType(file.name),
      }));
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  const updateFileTitle = (index, title) => {
    const updatedFiles = [...files];
    updatedFiles[index] = { ...updatedFiles[index], title };
    onChange(updatedFiles);
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf", "xls", "xlsx", "txt"].includes(extension))
      return "document";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) return "video";
    return "document"; // Default to document for any unrecognized file type
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
          colorScheme="blue"
          variant="outline"
          size="md"
        >
          Attach Lesson Materials
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
              {files.map((fileObj, index) => (
                <Box key={index} p={3} bg="gray.100" borderRadius="md">
                  <Stack spacing={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text>
                        {getFileIcon(fileObj.file.name)} {fileObj.file.name} (
                        {(fileObj.file.size / 1024).toFixed(2)} KB)
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
                    <FormControl>
                      <FormLabel fontSize="sm">
                        File Title (shown to students)
                      </FormLabel>
                      <Input
                        size="sm"
                        value={fileObj.title}
                        onChange={(e) => updateFileTitle(index, e.target.value)}
                        placeholder="Enter a title for this file"
                      />
                    </FormControl>
                  </Stack>
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

// Tooltip helper component
const InfoTooltip = ({ label }) => (
  <Tooltip label={label} placement="top" hasArrow>
    <Icon as={MdHelpOutline} ml={1} color="gray.500" />
  </Tooltip>
);

export default function Index() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const {
    data: courseData,
    loading: courseLoading,
    HandleRender,
  } = useOutletContext();

  const { user } = useAuth();
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const [currentUpload, setCurrentUpload] = useState({
    type: null, // 'video' or 'files'
    fileName: "",
    fileSize: 0,
    filesCount: 0,
  });
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(LessonCreationSchema),
    mode: "onBlur",
    defaultValues: {
      section: "",
      lessonFiles: [], // Initialize empty array for lesson files
      is_published: false, // Default to draft mode
      day_limit: 30, // Default 30 days access
      views_limit: 10, // Default 10 views
      order_id: 1, // Default order
    },
  });

  const section = watch("section");
  const order = watch("order_id");
  const video = useWatch({ control, name: "video" });
  const lessonFiles = useWatch({ control, name: "lessonFiles" });
  const isPublished = watch("is_published");

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };

      video.onerror = function () {
        reject("Cannot load video metadata");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data) => {
    if (!section) {
      toast({
        title: "Section is required",
        description: "Please select a section for this lesson",
        status: "error",
      });
      return;
    }

    try {
      // Get video duration before upload
      const videoDurationInSeconds = await getVideoDuration(data.video).catch(
        (err) => {
          console.error("Error getting video duration:", err);
          return 0; // Fallback to 0 if duration can't be determined
        }
      );

      // Format the duration as HH:MM:SS
      const formattedDuration = formatDuration(videoDurationInSeconds);

      // Upload video using the refactored ImageUploader with progress tracking
      setCurrentUpload({
        type: "video",
        fileName: data.video.name,
        fileSize: data.video.size,
        filesCount: 1,
      });

      const [{ URL: videoUrl }] = await ImageUploader({
        path: "videos",
        files: [data.video],
        useBunny: true,
        onProgress: (percent) => {
          setUploadingPercent(percent);
        },
      });

      if (!videoUrl) {
        throw new Error("Video upload successful but URL not received");
      }

      // Upload lesson attachment files if any
      let lessonAttachments = [];
      if (lessonFiles && lessonFiles.length > 0) {
        setCurrentUpload({
          type: "files",
          fileName: `${lessonFiles.length} file(s)`,
          fileSize: lessonFiles.reduce(
            (total, fileObj) => total + fileObj.file.size,
            0
          ),
          filesCount: lessonFiles.length,
        });

        const filesToUpload = lessonFiles.map((fileObj) => fileObj.file);
        const uploadedFiles = await ImageUploader({
          path: "LessonFiles",
          files: filesToUpload,
          useBunny: true,
          onProgress: (progress) => {
            setUploadingPercent(progress);
          },
        });

        lessonAttachments = uploadedFiles.map(({ URL }, index) => ({
          title: lessonFiles[index].title || lessonFiles[index].file.name,
          type: lessonFiles[index].type,
          url: URL,
        }));
      }

      // Reset upload state
      setUploadingPercent(0);
      setCurrentUpload({
        type: null,
        fileName: "",
        fileSize: 0,
        filesCount: 0,
      });

      const lessonData = {
        title: data.title,
        course: courseId,
        description: data.description,
        is_published: data.is_published,
        day_limit: data.day_limit,
        views_limit: data.views_limit,
        video_url: videoUrl,
        section: section,
        length: formattedDuration,
        order_id: order,
        lesson_attachment: lessonAttachments,
      };

      await axiosInstance.post("/lessons/", lessonData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
          "Content-Type": "application/json",
        },
      });

      toast({
        title: data.is_published
          ? "Lesson published successfully"
          : "Lesson saved as draft",
        description: data.is_published
          ? "Students can now access this lesson"
          : "You can publish this lesson later",
        status: "success",
      });

      // Refresh the parent data after successful creation
      if (HandleRender) {
        await HandleRender();
      }

      navigate(`/courses/${courseId}/lessons`);
    } catch (error) {
      console.error("Error in lesson creation process:", error);

      // More specific error messages based on error stage
      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        // Server responded with an error
        errorMessage = `Server error: ${
          error.response.data?.message || error.response.statusText
        }`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "Network error: No response from server";
      } else if (error.message) {
        // Error in setting up the request
        errorMessage = error.message;
      }

      toast({
        title: "Failed to create lesson",
        description: errorMessage,
        status: "error",
      });
      setUploadingPercent(0);
      setCurrentUpload({
        type: null,
        fileName: "",
        fileSize: 0,
        filesCount: 0,
      });
    }
  };

  return (
    <>
      <UploadProgressModal
        isOpen={uploadingPercent > 0}
        uploadProgress={uploadingPercent}
        fileName={currentUpload.fileName}
        fileSize={currentUpload.fileSize}
        uploadType={currentUpload.type}
        filesCount={currentUpload.filesCount}
      />
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Heading size="md">Create New Lesson</Heading>
          <Flex align="center">
            <Text mr={2} fontWeight="medium">
              Draft
            </Text>
            <Switch
              colorScheme="green"
              size="lg"
              {...register("is_published")}
            />
            <Text ml={2} fontWeight="medium">
              Publish
            </Text>
          </Flex>
        </Flex>
        <Text color={isPublished ? "green.500" : "orange.500"} fontSize="sm">
          {isPublished
            ? "This lesson will be published and visible to students immediately"
            : "This lesson will be saved as a draft and hidden from students"}
        </Text>
        <Divider />

        <Card variant="outline" mb={4}>
          <CardBody>
            <Heading size="sm" mb={4}>
              Basic Information
            </Heading>

            <Skeleton isLoaded={!courseLoading} mb={4}>
              <FormControl isInvalid={!!errors.section} mb={4}>
                <FormLabel fontWeight="medium">
                  Section
                  <InfoTooltip label="Choose which section of your course this lesson belongs to" />
                </FormLabel>
                <Select
                  placeholder="Select a section"
                  {...register("section")}
                  onChange={(e) => {
                    setValue("section", e.target.value);
                  }}
                >
                  {courseData?.sections?.map((item) => (
                    <option value={item.id} key={item?.id}>
                      {item?.title}
                    </option>
                  ))}
                </Select>
                {errors.section && (
                  <ErrorText>{errors.section.message}</ErrorText>
                )}
              </FormControl>
            </Skeleton>

            <FormControl isInvalid={!!errors.title} mb={4}>
              <FormLabel fontWeight="medium">
                Lesson Title
                <InfoTooltip label="A clear, descriptive title for your lesson" />
              </FormLabel>
              <InputElement
                Icon={MdOutlineSubtitles}
                placeholder="e.g., Introduction to React Hooks"
                register={register}
                name="title"
                errors={errors}
                size="lg"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.description} mb={4}>
              <FormLabel fontWeight="medium">
                Lesson Description
                <InfoTooltip label="Provide a detailed description of what students will learn" />
              </FormLabel>
              <InputElement
                size="lg"
                Icon={MdOutlineSubtitles}
                placeholder="Describe the content and learning objectives of this lesson"
                register={register}
                as={Textarea}
                name="description"
                errors={errors}
                minH="100px"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.order_id} mb={4}>
              <FormLabel fontWeight="medium">
                Lesson Order
                <InfoTooltip label="The position of this lesson within its section (1 is first)" />
              </FormLabel>
              <InputElement
                size="lg"
                Icon={FaSort}
                placeholder="Lesson position number"
                register={register}
                type="number"
                name="order_id"
                errors={errors}
                onKeyDown={(e) => {
                  // Prevent decimal point and non-numeric values
                  if (
                    e.key === "." ||
                    e.key === "e" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                inputProps={{
                  step: 1,
                  min: 1,
                  pattern: "[0-9]*",
                }}
              />
            </FormControl>
          </CardBody>
        </Card>

        <Card variant="outline" mb={4}>
          <CardBody>
            <Heading size="sm" mb={4}>
              Access Restrictions
            </Heading>

            <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
              <FormControl isInvalid={!!errors.day_limit} flex="1">
                <FormLabel fontWeight="medium">
                  Days Available
                  <InfoTooltip label="How many days students can access this lesson after enrollment" />
                </FormLabel>
                <InputElement
                  size="lg"
                  Icon={FaClock}
                  placeholder="Number of days"
                  register={register}
                  type="number"
                  name="day_limit"
                  errors={errors}
                  inputProps={{
                    min: 1,
                    max: 365,
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.views_limit} flex="1">
                <FormLabel fontWeight="medium">
                  View Limit
                  <InfoTooltip label="Maximum number of times students can watch this video" />
                </FormLabel>
                <InputElement
                  size="lg"
                  Icon={FaEye}
                  placeholder="Number of views"
                  register={register}
                  type="number"
                  name="views_limit"
                  errors={errors}
                  inputProps={{
                    min: 1,
                    max: 1000,
                  }}
                />
              </FormControl>
            </Flex>
          </CardBody>
        </Card>

        <Card variant="outline" mb={4}>
          <CardBody>
            <Heading size="sm" mb={4}>
              Lesson Content
            </Heading>

            <FormControl isInvalid={!!errors.video} mb={6}>
              <FormLabel fontWeight="medium">
                Lesson Video
                <InfoTooltip label="Upload your lesson video (MP4 format recommended)" />
              </FormLabel>
              <Controller
                name="video"
                control={control}
                render={({ field }) => (
                  <VideoUploader
                    video={field.value}
                    onChange={(file) => field.onChange(file)}
                  />
                )}
              />
              {errors.video && <ErrorText>{errors.video.message}</ErrorText>}
            </FormControl>

            <FormControl isInvalid={!!errors.lessonFiles} mb={4}>
              <FormLabel fontWeight="medium">
                Supplementary Materials (Optional)
                <InfoTooltip label="Add PDFs, documents, or other resources for students" />
              </FormLabel>
              <Controller
                control={control}
                name="lessonFiles"
                render={({ field }) => (
                  <FileUploader
                    files={field.value}
                    onChange={(files) => field.onChange(files)}
                    isInvalid={!!errors.lessonFiles}
                    errorMessage={errors.lessonFiles?.message}
                  />
                )}
              />
            </FormControl>
          </CardBody>
        </Card>

        <Flex gap={3} justify="flex-end">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}/lessons`)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            isLoading={isSubmitting}
            colorScheme="blue"
            type="submit"
            leftIcon={<FaUpload />}
          >
            {isPublished ? "Publish Lesson" : "Save as Draft"}
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
