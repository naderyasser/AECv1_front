import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FileUploader } from "react-drag-drop-files";
import { BiEdit } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";

export const PDFUploader = ({ pdf, onChangePdf, onRemovePdf }) => {
  const PdfSrc = useMemo(() => {
    return pdf && pdf instanceof File ? URL.createObjectURL(pdf) : pdf;
  }, [pdf]);
  return (
    <Box
      bgColor="orange.200"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      p="10px"
      gap="10px"
      overflow="hidden"
      borderRadius="lg"
      border="2px"
      borderColor="orange"
    >
      {PdfSrc ? (
        <Box
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p="10px"
          flexDir="column"
          gap="10px"
        >
          <AspectRatio w="100%" maxW="700px" ratio={16 / 9}>
            <iframe
              style={{
                borderRadius: "6px",
              }}
              loading="lazy"
              src={PdfSrc}
              allowFullScreen
            />
          </AspectRatio>
          <ButtonGroup gap="10px">
            <Tooltip label="remove Pdf">
              <IconButton onClick={onRemovePdf} colorScheme="red">
                <GiCancel />
              </IconButton>
            </Tooltip>
            <Tooltip label="Change Pdf">
              <Button colorScheme="green">
                <label
                  htmlFor="1"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <BiEdit />
                </label>
                <input
                  onChange={(e) => {
                    onChangePdf(e.target.files[0]);
                  }}
                  id="1"
                  hidden
                  type="file"
                  accept=".pdf"
                />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>
      ) : (
        <>
          <Button colorScheme="orange">Files</Button>
          <FileUploader
            handleChange={onChangePdf}
            name="file"
            types={["pdf"]}
            classes="drop_zone"
          />
        </>
      )}
    </Box>
  );
};
