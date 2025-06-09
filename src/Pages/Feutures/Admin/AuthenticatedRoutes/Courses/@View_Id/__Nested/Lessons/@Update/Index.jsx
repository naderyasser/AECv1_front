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
} from "@chakra-ui/react";
import React, { useCallback, useState, useEffect } from "react";
import { InputElement } from "../../../../../../../../../Components/Common/InputElement/InputElement";
import { MdLockClock, MdOutlineSubtitles } from "react-icons/md";
import { VideoUploader } from "../../../../../../../../../Components/Common/VideoUploader/VideoUploader";
import { ImageUploader } from "../../../../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { PDFUploader } from "../../../../../../../../../Components/Common/PdfUploader/PdfUploader";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonCreationSchema } from "./schema";
import { ErrorText } from "../../../../../../../../../Components/Common/ErrorText/ErrorText";
import axiosInstance from "../../../../../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../../../../../Context/UserDataProvider/UserDataProvider";
import { uploadToVimeoWithTus } from "../../../../../../../../../Utils/VimeoVideoUploader/VimeoVideoUploader";
import { UploadProgressModal } from "../../../../../../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FaClock, FaEye, FaUpload, FaSort, FaFileAlt } from "react-icons/fa";
import axios from "axios";
import { uploadToBunnyWithTus } from "../../../../../../../../../Utils/BunnyVideoUploader/BunnyVideoUploader";
import { useFetch } from "../../../../../../../../../Hooks/Index";
import { ImageUploader as FirebaseImageUploader } from "../../../../../../../../../@Firebase/Utils/Common/ImageUploader/ImageUploader";

// FileUploader component for lesson attachments
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
    const removedFile = updatedFiles[index];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles, removedFile); // Pass the removed file to parent
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return "📁"; // Default icon if filename is undefined

    // Check if it's a URL or a File object
    if (typeof fileName === "string") {
      // If it's a URL, extract the filename
      const urlPath = fileName.split("/").pop();
      if (!urlPath) return "📁";

      const extension = urlPath.split(".").pop().toLowerCase();
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
    } else if (fileName.name) {
      // If it's a File object with name property
      const extension = fileName.name.split(".").pop().toLowerCase();
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
    }

    return "📁"; // Default fallback
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
          Attach Lesson Files
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
              {files.map((file, index) => {
                // Handle both File objects and URL objects
                const isFileObject = file instanceof File;
                const fileName = isFileObject ? file.name : file.title;

                const fileSize = isFileObject
                  ? (file.size / 1024).toFixed(2)
                  : null;

                return (
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
                      {getFileIcon(isFileObject ? file.name : fileName)}{" "}
                      {fileName}
                      {fileSize && `(${fileSize} KB)`}
                      {!isFileObject && ` (Existing file)`}
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
                );
              })}
            </Stack>
          </Box>
        )}

        {isInvalid && <ErrorText>{errorMessage}</ErrorText>}
      </Stack>
    </Box>
  );
};

export default function Index() {
  const navigate = useNavigate();
  const { id: courseId, lessonId } = useParams();
  const {
    data: courseData,
    loading: courseLoading,
    HandleRender,
  } = useOutletContext() || {};
  const {
    loading,
    error,
    data: lessonData,
  } = useFetch({
    endpoint: `/lessons/${lessonId}/`,
  });
  const { user } = useAuth();
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const [videoChanged, setVideoChanged] = useState(false);
  const [currentUpload, setCurrentUpload] = useState({
    type: null, // 'video' or 'files'
    fileName: "",
    fileSize: 0,
    filesCount: 0,
  });
  const [removedFiles, setRemovedFiles] = useState([]);
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
    reset,
  } = useForm({
    resolver: zodResolver(LessonCreationSchema),
    mode: "onBlur",
    defaultValues: {
      section: "",
      title: "",
      description: "",
      // is_done: false,
      day_limit: 0,
      views_limit: 0,
      order_id: 0,
      lessonFiles: [], // Initialize empty array for lesson files
    },
  });

  useEffect(() => {
    if (lessonData) {
      reset({
        section: lessonData.section || "",
        title: lessonData.title || "",
        description: lessonData.description || "",
        // is_done: lessonData.is_done || false,
        day_limit: lessonData.day_limit || 0,
        views_limit: lessonData.views_limit || 0,
        order_id: lessonData.order_id || 0,
        video: lessonData.video_url ? { url: lessonData.video_url } : undefined,
        lessonFiles: lessonData.lesson_attachment || [], // Add existing attachments
      });
      // Reset removed files when lesson data is loaded
      setRemovedFiles([]);
    }
  }, [lessonData, reset]);

  const section = watch("section");
  const order = watch("order_id");
  const video = useWatch({ control, name: "video" });
  const lessonFiles = useWatch({ control, name: "lessonFiles" });

  const updateLessonHelper = useCallback(
    async (lessonId, data) => {
      const req = await axiosInstance.put(`/lessons/${lessonId}/`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token.access || user.data.token}`,
          "Content-Type": "application/json",
        },
      });
      return req;
    },
    [user.data.token]
  );

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

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf", "xls", "xlsx", "txt"].includes(extension))
      return "document";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) return "video";
    return "document"; // Default to document for any unrecognized file type
  };

  // Function to update UI after updating a lesson
  const updateUIAfterUpdate = async () => {
    if (HandleRender) {
      try {
        await HandleRender();
        return true;
      } catch (error) {
        console.error("Error refreshing lessons data:", error);
        return false;
      }
    }
    return false;
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
      let videoUrl = lessonData?.video_url;
      let formattedDuration = lessonData?.length;

      if (data.video && data.video instanceof File) {
        // Set current upload to track video upload progress
        setCurrentUpload({
          type: "video",
          fileName: data.video.name,
          fileSize: data.video.size,
          filesCount: 1,
        });

        const videoDurationInSeconds = await getVideoDuration(data.video).catch(
          (err) => {
            console.error("Error getting video duration:", err);
            return 0;
          }
        );

        formattedDuration = formatDuration(videoDurationInSeconds);

        // Upload video using FirebaseImageUploader
        const [{ URL: uploadedVideoUrl }] = await FirebaseImageUploader({
          path: "videos",
          files: [data.video],
          useBunny: true,
          onProgress: (percent) => {
            setUploadingPercent(percent);
          },
        });

        videoUrl = uploadedVideoUrl;
        if (!videoUrl) {
          throw new Error("Video upload successful but URL not received");
        }
      }

      // Handle lesson attachment files if any new ones are added
      let lessonAttachments = lessonData?.lesson_attachment || [];

      // Filter out File objects and files that were removed
      const newFiles = lessonFiles.filter((file) => file instanceof File);

      // Keep only existing attachments that weren't removed
      const existingAttachments = lessonFiles.filter(
        (file) =>
          !(file instanceof File) &&
          !removedFiles.some(
            (removed) =>
              removed.id === file.id ||
              (removed.url === file.url && removed.title === file.title)
          )
      );

      if (newFiles.length > 0) {
        setCurrentUpload({
          type: "files",
          fileName: `${newFiles.length} file(s)`,
          fileSize: newFiles.reduce((total, file) => total + file.size, 0),
          filesCount: newFiles.length,
        });

        const uploadedFiles = await FirebaseImageUploader({
          path: "LessonFiles",
          files: newFiles,
          useBunny: true,
          onProgress: (progress) => {
            setUploadingPercent(progress);
          },
        });

        // Combine existing attachments (that aren't File objects) with new uploads
        const newAttachments = uploadedFiles.map(({ URL }, index) => {
          const file = newFiles[index];
          return {
            title: file.name || `File ${index + 1}`,
            type: getFileType(file.name),
            url: URL,
          };
        });

        // Update to use the already filtered existingAttachments
        lessonAttachments = [...existingAttachments, ...newAttachments];
      } else {
        // If no new files, just use the filtered existing attachments
        lessonAttachments = existingAttachments;
      }

      // Reset upload tracking
      setUploadingPercent(0);
      setCurrentUpload({
        type: null,
        fileName: "",
        fileSize: 0,
        filesCount: 0,
      });

      const newLessonData = {
        title: data.title,
        course: courseId,
        description: data.description,
        // is_done: data.is_done,
        day_limit: data.day_limit,
        views_limit: data.views_limit,
        section: section,
        order_id: order,
        lesson_attachment: lessonAttachments,
      };

      if (videoUrl) {
        newLessonData.video_url = videoUrl;
      }

      if (formattedDuration) {
        newLessonData.length = formattedDuration;
      }

      await updateLessonHelper(lessonId, newLessonData);

      toast({
        title: "Lesson updated successfully",
        status: "success",
      });

      // Try to update UI first, then navigate
      const updated = await updateUIAfterUpdate();
      navigate(`/courses/${courseId}/lessons`);
    } catch (error) {
      console.error("Error in lesson update process:", error);

      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        errorMessage = `Server error: ${
          error.response.data?.message || error.response.statusText
        }`;
      } else if (error.request) {
        errorMessage = "Network error: No response from server";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to update lesson",
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
      <Skeleton isLoaded={!loading}>
        <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
          <Heading size="md">Update Lesson</Heading>
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
              onChange={(e) => {
                setValue("section", e.target.value);
              }}
              required
            >
              {courseData?.sections?.map((item) => {
                return (
                  <option value={item.id} key={item?.id}>
                    {item?.title}
                  </option>
                );
              })}
            </InputElement>
          </Skeleton>

          <InputElement
            Icon={MdOutlineSubtitles}
            placeholder="Title"
            register={register}
            name="title"
            errors={errors}
            size="lg"
          />

          <InputElement
            size="lg"
            Icon={MdOutlineSubtitles}
            placeholder="Description"
            register={register}
            as={Textarea}
            name="description"
            errors={errors}
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
          </Checkbox> */}

          <InputElement
            size="lg"
            Icon={FaClock}
            placeholder="days limit"
            register={register}
            type="number"
            name="day_limit"
            errors={errors}
          />

          <InputElement
            size="lg"
            Icon={FaEye}
            placeholder="views limit"
            register={register}
            type="number"
            name="views_limit"
            errors={errors}
          />

          <InputElement
            size="lg"
            Icon={FaSort}
            placeholder="Lesson Order"
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
              min: 0,
              pattern: "[0-9]*",
            }}
          />

          <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <VideoUploader
                video={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  if (file instanceof File) {
                    setVideoChanged(true);
                  }
                }}
              />
            )}
          />
          <ErrorText>{errors.video?.message}</ErrorText>

          {/* Add the lesson attachments uploader */}
          <Controller
            control={control}
            name="lessonFiles"
            render={({ field }) => (
              <FileUploader
                files={field.value}
                onChange={(files, removedFile) => {
                  field.onChange(files);
                  // If a file was removed and it's not a File object (it's an existing file), track it
                  if (removedFile && !(removedFile instanceof File)) {
                    setRemovedFiles((prev) => [...prev, removedFile]);
                  }
                }}
                isInvalid={!!errors.lessonFiles}
                errorMessage={errors.lessonFiles?.message}
              />
            )}
          />

          <Button
            size="lg"
            isLoading={isSubmitting}
            colorScheme="blue"
            type="submit"
          >
            Update Lesson
          </Button>
        </Stack>
      </Skeleton>
    </>
  );
}
