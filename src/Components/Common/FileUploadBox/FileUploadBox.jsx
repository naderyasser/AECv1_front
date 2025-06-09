import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  useToast,
  VStack,
  Image,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
import { FaUpload as CloudUploadIcon } from "react-icons/fa6";
import { MdCancel, MdFileOpen } from "react-icons/md";
export const FileUploadBox = ({
  label,
  description,
  accept,
  register,
  name,
  error,
  watch,
  setValue,
}) => {
  const file = watch(name)?.[0];
  const toast = useToast();

  const handleRemove = () => {
    setValue(name, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (!ACCEPTED_FILE_TYPES.includes(droppedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF and image files are accepted",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (droppedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setValue(name, [droppedFile]);
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      {description && (
        <Text fontSize="xs" color="gray.600" mb={3}>
          {description}
        </Text>
      )}
      <Box
        borderWidth={2}
        borderRadius="md"
        borderStyle="dashed"
        borderColor={error ? "red.500" : "gray.200"}
        p={6}
        textAlign="center"
        position="relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        bg={file ? "gray.50" : "transparent"}
      >
        {file ? (
          <FilePreview file={file} onRemove={handleRemove} />
        ) : (
          <VStack spacing={2}>
            <CloudUploadIcon size={24} />
            <Text fontSize={{ base: "sm", md: "md" }}>
              Drag and drop or click to upload
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
              PDF or Image files only (max 5MB)
            </Text>
          </VStack>
        )}
        <Input
          type="file"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          opacity="0"
          aria-hidden="true"
          accept={accept}
          {...register(name)}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > MAX_FILE_SIZE) {
                toast({
                  title: "File too large",
                  description: "Maximum file size is 5MB",
                  status: "error",
                  duration: 3000,
                });
                e.target.value = null;
                return;
              }
              if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                toast({
                  title: "Invalid file type",
                  description: "Only PDF and image files are accepted",
                  status: "error",
                  duration: 3000,
                });
                e.target.value = null;
                return;
              }
            }
            register(name).onChange(e);
          }}
        />
      </Box>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
const FilePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (file && file?.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={2}
      position="relative"
      bg="gray.50"
      w="full"
    >
      <HStack spacing={2} align="center">
        {file?.type?.startsWith("image/") ? (
          <Image
            src={preview}
            alt="Preview"
            maxH="100px"
            objectFit="contain"
            borderRadius="md"
          />
        ) : (
          <Icon as={MdFileOpen} boxSize={6} color="blue.500" />
        )}
        <VStack align="start" flex={1} spacing={0}>
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {file?.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {(file?.size / 1024 / 1024).toFixed(2)} MB
          </Text>
        </VStack>
        <IconButton
          size="lg"
          variant="ghost"
          colorScheme="red"
          onClick={onRemove}
          aria-label="Remove file"
          pos="relative"
          zIndex="10"
        >
          <MdCancel />
        </IconButton>
      </HStack>
    </Box>
  );
};
