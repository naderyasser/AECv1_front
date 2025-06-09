import { Button } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

export const StyledBtn = ({
  children,
  theme = "red",
  size = "md",
  variant = "solid",
  style,
  fullWidth = true,
  justify = "center",
  ...rest
}) => {
  return (
    <StyledWrapper
      style={style}
      theme={theme}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      justify={justify}
    >
      <Button mt="2" {...rest}>
        <span className="shadow" />
        <span className="edge" />
        <span className="front text">{children}</span>
      </Button>
    </StyledWrapper>
  );
};

const themeColors = {
  red: {
    background: "hsl(345deg 100% 47%)",
    edge: "linear-gradient(to left, hsl(340deg 100% 16%) 0%, hsl(340deg 100% 32%) 8%, hsl(340deg 100% 32%) 92%, hsl(340deg 100% 16%) 100%)",
    color: "white",
  },
  blue: {
    background: "hsl(220deg 100% 50%)",
    edge: "linear-gradient(to left, hsl(220deg 100% 16%) 0%, hsl(220deg 100% 32%) 8%, hsl(220deg 100% 32%) 92%, hsl(220deg 100% 16%) 100%)",
    color: "white",
  },
  green: {
    background: "hsl(140deg 100% 40%)",
    edge: "linear-gradient(to left, hsl(140deg 100% 16%) 0%, hsl(140deg 100% 32%) 8%, hsl(140deg 100% 32%) 92%, hsl(140deg 100% 16%) 100%)",
    color: "white",
  },
  purple: {
    background: "hsl(280deg 100% 50%)",
    edge: "linear-gradient(to left, hsl(280deg 100% 16%) 0%, hsl(280deg 100% 32%) 8%, hsl(280deg 100% 32%) 92%, hsl(280deg 100% 16%) 100%)",
    color: "white",
  },
  orange: {
    background: "hsl(30deg 100% 50%)",
    edge: "linear-gradient(to left, hsl(30deg 100% 16%) 0%, hsl(30deg 100% 32%) 8%, hsl(30deg 100% 32%) 92%, hsl(30deg 100% 16%) 100%)",
    color: "white",
  },
};

const sizeStyles = {
  sm: {
    padding: "8px 18px",
    fontSize: "0.9rem",
  },
  md: {
    padding: "12px 27px",
    fontSize: "1rem",
  },
  lg: {
    padding: "16px 36px",
    fontSize: "1.3rem",
  },
};

const StyledWrapper = styled.div`
  button {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
    user-select: none;
    touch-action: manipulation;
    width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: ${({ variant, theme }) =>
      variant === "solid" ? "hsl(0deg 0% 0% / 0.25)" : "transparent"};
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: ${({ variant, theme }) =>
      variant === "solid"
        ? themeColors[theme]?.edge
        : variant === "outline"
        ? "transparent"
        : "transparent"};
    border: ${({ variant, theme }) =>
      variant === "outline"
        ? `2px solid ${themeColors[theme]?.background}`
        : "none"};
  }

  .front {
    display: flex;
    gap: 10px;
    position: relative;
    padding: ${({ size }) => sizeStyles[size]?.padding};
    border-radius: 12px;
    font-size: ${({ size }) => sizeStyles[size]?.fontSize};
    color: ${({ variant, theme }) =>
      variant === "solid"
        ? themeColors[theme]?.color
        : themeColors[theme]?.background};
    background: ${({ variant, theme }) =>
      variant === "solid"
        ? themeColors[theme]?.background
        : variant === "outline"
        ? "transparent"
        : "transparent"};
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
    width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
    justify-content: ${({ justify }) => justify};
  }

  button:hover {
    filter: brightness(110%);
  }

  button:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  button:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  button:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  button:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  button:focus:not(:focus-visible) {
    outline: none;
  }
`;
