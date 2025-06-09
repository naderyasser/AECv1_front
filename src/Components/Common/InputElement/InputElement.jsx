import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Stack,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { MdCancel } from "react-icons/md";
import { ErrorText } from "../ErrorText/ErrorText";
import { forwardRef } from "react";
import { IoTextSharp } from "react-icons/io5";

export const InputElement = forwardRef(
  (
    {
      Icon = IoTextSharp,
      name,
      errorRef = name,
      placeholder = name,
      errors = {},
      register = () => {},
      type,
      containerStyles,
      as,
      noIcon,
      heightAlignedCenter,
      ...rest
    },
    ref
  ) => {
    return (
      <Stack w="100%" {...containerStyles}>
        <InputGroup variant="filled">
          {Icon && !noIcon && (
            <InputLeftElement
              sx={{
                [(!as || heightAlignedCenter) && "h"]: "100%",
              }}
              pointerEvents="none"
            >
              <Icon
                style={{
                  color: "gray",
                }}
              />
            </InputLeftElement>
          )}

          <Input
            as={as}
            isInvalid={errors[errorRef]}
            placeholder={placeholder}
            ref={ref}
            type={type}
            {...register(name, {
              valueAsNumber: type === "number",
            })}
            {...rest}
          />
          {errors[errorRef] && (
            <InputRightElement
              sx={{
                [!as && "h"]: "100%",
              }}
              pointerEvents="none"
            >
              <MdCancel
                style={{
                  color: "red",
                }}
              />
            </InputRightElement>
          )}
        </InputGroup>
        <ErrorText>{errors[errorRef]?.message}</ErrorText>
      </Stack>
    );
  }
);

InputElement.displayName = "InputElement";
