import { Radio, Tooltip } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  overflow: hidden;
  border-radius: 0.375rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.31);
  position: relative;
  z-index: 1;
`;

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionContainer = styled.div`
  position: relative;
  display: flex;
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
  z-index: 0;
  &:has(input:checked) {
    z-index: -1;
  }
`;

const RadioInput = styled.input`
  position: relative;
  z-index: 10;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
`;

const RadioBackground = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  padding: 0.5rem;
  background-color: ${(props) => props.$color};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.31);
  transition: all 300ms ease-in-out;

  ${RadioInput}:checked + & {
    transform: scale(1.1);
    box-shadow: 0 0 0 2px ${(props) => props.$borderColor};
  }
`;

const ExpandingBackground = styled.div`
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  transform: scale(0);
  background-color: ${(props) => props.$expandColor};
  transition: transform 500ms ease-in-out;

  ${RadioInput}:checked ~ & {
    transform: scale(500%);
  }
`;

const IconSvg = styled.svg`
  position: absolute;
  stroke: ${(props) => props.$color};
  fill: ${(props) => props.$fill || "none"};
`;

const genderOptions = [
  {
    label: "man",
    value: "male",
    color: "rgb(219 234 254)",
    borderColor: "rgb(96 165 250)",
    expandColor: "rgb(191 219 254)",
    paths: [
      `M15.5631 16.1199C14.871 16.81 13.9885 17.2774 13.0288 17.462C12.0617 17.6492 11.0607 17.5459 10.1523 17.165C8.29113 16.3858 7.07347 14.5723 7.05656 12.5547C7.04683 11.0715 7.70821 9.66348 8.8559 8.72397C10.0036 7.78445 11.5145 7.4142 12.9666 7.71668C13.9237 7.9338 14.7953 8.42902 15.4718 9.14008C16.4206 10.0503 16.9696 11.2996 16.9985 12.6141C17.008 13.9276 16.491 15.1903 15.5631 16.1199Z`,
      "M14.9415 8.60977C14.6486 8.90266 14.6486 9.37754 14.9415 9.67043C15.2344 9.96332 15.7093 9.96332 16.0022 9.67043L14.9415 8.60977ZM18.9635 6.70907C19.2564 6.41617 19.2564 5.9413 18.9635 5.64841C18.6706 5.35551 18.1958 5.35551 17.9029 5.64841L18.9635 6.70907ZM16.0944 5.41461C15.6802 5.41211 15.3424 5.74586 15.3399 6.16007C15.3374 6.57428 15.6711 6.91208 16.0853 6.91458L16.0944 5.41461ZM18.4287 6.92872C18.8429 6.93122 19.1807 6.59747 19.1832 6.18326C19.1857 5.76906 18.8519 5.43125 18.4377 5.42875L18.4287 6.92872ZM19.1832 6.17421C19.1807 5.76001 18.8429 5.42625 18.4287 5.42875C18.0145 5.43125 17.6807 5.76906 17.6832 6.18326L19.1832 6.17421ZM17.6973 8.52662C17.6998 8.94082 18.0377 9.27458 18.4519 9.27208C18.8661 9.26958 19.1998 8.93177 19.1973 8.51756L17.6973 8.52662ZM16.0022 9.67043L18.9635 6.70907L17.9029 5.64841L14.9415 8.60977L16.0022 9.67043ZM16.0853 6.91458L18.4287 6.92872L18.4377 5.42875L16.0944 5.41461L16.0853 6.91458ZM17.6832 6.18326L17.6973 8.52662L19.1973 8.51756L19.1832 6.17421L17.6832 6.18326Z",
    ],
  },
  {
    label: "female",
    value: "female",
    color: "rgb(252 231 243)",
    borderColor: "rgb(244 114 182)",
    expandColor: "rgb(251 207 232)",
    paths: [
      "M20 9C20 13.0803 16.9453 16.4471 12.9981 16.9383C12.9994 16.9587 13 16.9793 13 17V19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H13V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V21H10C9.44772 21 9 20.5523 9 20C9 19.4477 9.44772 19 10 19H11V17C11 16.9793 11.0006 16.9587 11.0019 16.9383C7.05466 16.4471 4 13.0803 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9ZM6.00365 9C6.00365 12.3117 8.68831 14.9963 12 14.9963C15.3117 14.9963 17.9963 12.3117 17.9963 9C17.9963 5.68831 15.3117 3.00365 12 3.00365C8.68831 3.00365 6.00365 5.68831 6.00365 9Z",
    ],
  },
  {
    label: "none",
    value: "none",
    color: "rgb(245 245 245)",
    borderColor: "rgb(163 163 163)",
    expandColor: "rgb(229 229 229)",
    paths: [
      "M8.19531 8.76498C8.42304 8.06326 8.84053 7.43829 9.40137 6.95899C9.96221 6.47968 10.6444 6.16501 11.373 6.0494C12.1017 5.9338 12.8486 6.02202 13.5303 6.3042C14.2119 6.58637 14.8016 7.05166 15.2354 7.64844C15.6691 8.24521 15.9295 8.95008 15.9875 9.68554C16.0455 10.421 15.8985 11.1581 15.5636 11.8154C15.2287 12.4728 14.7192 13.0251 14.0901 13.4106C13.4611 13.7961 12.7377 14.0002 12 14.0002V14.9998M12.0498 19V19.1L11.9502 19.1002V19H12.0498Z",
    ],
  },
];

export const GenderSelector = () => {
  return (
    <Container>
      <OptionsWrapper>
        {genderOptions.map((option) => (
          <Tooltip key={option.value} label={option.label}>
            <OptionContainer>
              <RadioInput type="radio" name="gender" value={option.value} />
              <RadioBackground
                $color={option.color}
                $borderColor={option.borderColor}
              />
              <ExpandingBackground $expandColor={option.expandColor} />
              <IconSvg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                $color={option.borderColor}
              >
                {option.paths.map((d, index) => (
                  <path
                    key={index}
                    d={d}
                    // strokeWidth="1.5"
                    // strokeLinecap="round"
                    // strokeLinejoin="round"
                  />
                ))}
              </IconSvg>
            </OptionContainer>
          </Tooltip>
        ))}
      </OptionsWrapper>
    </Container>
  );
};
