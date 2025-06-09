import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { PiEyeClosed } from "react-icons/pi";
import styles from "./styles.module.css";
export const PasswordInput = forwardRef(
  ({ sx, noIcon = false, Icon, size, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <InputGroup size={size} variant="filled" sx={sx}>
        {Icon && !noIcon && (
          <InputLeftElement h="100%" pointerEvents="none">
            <Icon
              style={{
                color: "gray",
              }}
            />
          </InputLeftElement>
        )}
        <Input ref={ref} type={show ? "text" : "password"} {...rest} />
        <InputRightAddon
          cursor="pointer"
          onClick={() => setShow(!show)}
          overflow="hidden"
        >
          {show ? (
            <FaEye key={show} className={styles["opacity-animation"]} />
          ) : (
            <PiEyeClosed key={show} className={styles["opacity-animation"]} />
          )}
        </InputRightAddon>
      </InputGroup>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
