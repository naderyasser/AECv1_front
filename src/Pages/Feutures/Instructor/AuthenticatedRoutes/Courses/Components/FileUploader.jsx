import React, { useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaFileAlt } from "react-icons/fa";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";

export const FileUploader = ({
  files = [],
  onChange,
  isInvalid,
  errorMessage,
}) => {
  const fileInputRef = useRef();

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

  const updateFileTitle = (index, newTitle) => {
    const newFiles = [...files];
    newFiles[index] = { ...newFiles[index], title: newTitle };
    onChange(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "doc";
      case "xls":
      case "xlsx":
        return "spreadsheet";
      case "jpg":
      case "jpeg":
      case "png":
        return "image";
      default:
        return "file";
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
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
              {files.map((fileObj, index) => {
                // Handle both File objects and URL objects
                const isFileObject = fileObj.file instanceof File;
                return (
                  <Box key={index} p={3} bg="gray.100" borderRadius="md">
                    <Stack spacing={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text>
                          {getFileIcon(
                            isFileObject ? fileObj.file.name : fileObj.title
                          )}{" "}
                          {isFileObject ? fileObj.file.name : fileObj.title}{" "}
                          {isFileObject && (
                            <span>
                              ({(fileObj.file.size / 1024).toFixed(2)} KB)
                            </span>
                          )}
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
                          File Title (for reference)
                        </FormLabel>
                        <Input
                          size="sm"
                          value={fileObj.title}
                          onChange={(e) =>
                            updateFileTitle(index, e.target.value)
                          }
                          placeholder="Enter a title for this file"
                        />
                      </FormControl>
                    </Stack>
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
