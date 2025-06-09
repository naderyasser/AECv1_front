import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Skeleton,
  Slider,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useFetch } from "../../../../../Hooks/Index";
import { Levels } from "../../../../../~Data/Levels";
const Languages = [
  {
    title: "Arabic",
  },
  {
    title: "English",
  },
  {
    title: "Espanol",
  },
];

const Status = [
  {
    title: "Online",
  },
  {
    title: "Offline",
  },
  {
    title: "Both",
  },
];
export const Filteration = ({
  value,
  onChange,
  onClear,
  onAddItemToList,
  onRemoveItemFromList,
  onCheckIfItemExist,
}) => {
  const { data, loading, error } = useFetch({
    endpoint: "categories",
  });

  return (
    <Stack gap="5" p="3" borderRadius="lg" w="300px" bgColor="white">
      <Stack gap="3">
        <Heading size="sm">Sort By</Heading>
        <Select placeholder="Newly puplished"></Select>
      </Stack>

      <Heading size="md">Price</Heading>
      <RadioGroup
        value={value.priceType}
        onChange={(value) => {
          onChange({
            path: "priceType",
            value,
          });
        }}
      >
        <Stack gap="5">
          <Radio value="Free">Free</Radio>
          <Radio value="Paid">Paid</Radio>
          {value.priceType === "Paid" && (
            <RangeSlider
              onChange={(value) => console.log(value)}
              aria-label={["min", "max"]}
              defaultValue={[30, 80]}
            >
              <RangeSliderTrack bg="blue.100">
                <RangeSliderFilledTrack bg="blue" />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={6} index={0}>
                <Box color="blue" />
              </RangeSliderThumb>
              <RangeSliderThumb boxSize={6} index={1}>
                <Box color="blue" />
              </RangeSliderThumb>
            </RangeSlider>
          )}
        </Stack>
      </RadioGroup>
      <Divider />
      <Heading size="md">Categories</Heading>
      <Stack minH="100px" as={Skeleton} isLoaded={!loading}>
        {data?.map((item) => {
          return (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onAddItemToList({
                    path: "categoriesSeleacted",
                    value: item.title,
                  });
                } else {
                  onRemoveItemFromList({
                    path: "categoriesSeleacted",
                    value: item.title,
                  });
                }
              }}
              isChecked={onCheckIfItemExist({
                path: "categoriesSeleacted",
                value: item.title,
              })}
              key={item.id}
            >
              {item.title}
            </Checkbox>
          );
        })}
      </Stack>
      <Divider />
      <Heading size="md">Language</Heading>
      <Stack>
        {Languages.map((item) => {
          return (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onAddItemToList({
                    path: "languagesSelected",
                    value: item.title,
                  });
                } else {
                  onRemoveItemFromList({
                    path: "languagesSelected",
                    value: item.title,
                  });
                }
              }}
              key={item.title}
              isChecked={onCheckIfItemExist({
                path: "languagesSelected",
                value: item.title,
              })}
            >
              {item.title}
            </Checkbox>
          );
        })}
      </Stack>
      <Divider />
      <Heading size="md">Author</Heading>
      <Stack>
        {Languages.map((item) => {
          return (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onAddItemToList({
                    path: "authorsSelected",
                    value: item.title,
                  });
                } else {
                  onRemoveItemFromList({
                    path: "authorsSelected",
                    value: item.title,
                  });
                }
              }}
              key={item.title}
              isChecked={onCheckIfItemExist({
                path: "authorsSelected",
                value: item.title,
              })}
            >
              {item.title}
            </Checkbox>
          );
        })}
      </Stack>
      <Divider />
      <Heading size="md">Levels</Heading>
      <Stack>
        {Levels.map((item) => {
          return (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onAddItemToList({
                    path: "levelsSelected",
                    value: item.title,
                  });
                } else {
                  onRemoveItemFromList({
                    path: "levelsSelected",
                    value: item.title,
                  });
                }
              }}
              key={item.title}
              isChecked={onCheckIfItemExist({
                path: "levelsSelected",
                value: item.title,
              })}
            >
              {item.title}
            </Checkbox>
          );
        })}
      </Stack>
      <Divider />
      <Heading size="md">Status</Heading>
      <Stack>
        {Status.map((item) => {
          return (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onAddItemToList({
                    path: "statusSelected",
                    value: item.title,
                  });
                } else {
                  onRemoveItemFromList({
                    path: "statusSelected",
                    value: item.title,
                  });
                }
              }}
              key={item.title}
              isChecked={onCheckIfItemExist({
                path: "statusSelected",
                value: item.title,
              })}
            >
              {item.title}
            </Checkbox>
          );
        })}
      </Stack>
      <Flex gap="4" justifyContent="center">
        <Button
          borderRadius="xl"
          size="lg"
          colorScheme="blue"
          variant="solid"
          flexGrow="1"
        >
          Filter
        </Button>
        <Button
          borderRadius="xl"
          size="lg"
          colorScheme="blue"
          variant="outline"
          flexGrow="1"
          onClick={onClear}
        >
          Clear
        </Button>
      </Flex>
    </Stack>
  );
};
