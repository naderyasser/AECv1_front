import React, { useEffect, useState } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  IconButton,
  Box,
  useDisclosure,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { BsCalendarDate } from "react-icons/bs";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

export const ChakraDatePicker = ({
  placeholder,
  onChange,
  value,
  minDate,
  maxDate,
  ...rest
}) => {
  const [selectedDate, setSelectedDate] = useState(
    (() => {
      if (value) {
        return value instanceof Date ? value : new Date(value);
      }
    })()
  );
  useEffect(() => {
    if (value) {
      setSelectedDate(value instanceof Date ? value : new Date(value));
    }
  }, [JSON.stringify(value)]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // Add padding days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Check if date is selectable
  const isDateSelectable = (date) => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange?.(date);
    onClose(); // Close modal after selection
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <InputGroup>
        <InputRightElement>
          <BsCalendarDate />
        </InputRightElement>
        <Input
          {...rest}
          placeholder={placeholder}
          value={selectedDate ? selectedDate?.toLocaleDateString() : ""}
          readOnly
          onClick={onOpen}
        />
      </InputGroup>

      <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <IconButton
                icon={<MdArrowLeft />}
                variant="ghost"
                onClick={() => navigateMonth(-1)}
                aria-label="Previous month"
              />
              <Text fontWeight="bold">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <IconButton
                icon={<MdArrowRight />}
                variant="ghost"
                onClick={() => navigateMonth(1)}
                aria-label="Next month"
              />
            </Flex>
          </ModalHeader>

          <ModalBody>
            {/* Weekday Headers */}
            <Flex
              mb={2}
              textAlign="center"
              fontWeight="semibold"
              color="gray.500"
            >
              {weekdays.map((day) => (
                <Box key={day} flex={1}>
                  {day}
                </Box>
              ))}
            </Flex>

            {/* Calendar Grid */}
            <Flex flexWrap="wrap">
              {calendarDays.map((day, index) => (
                <Box key={index} width="14.285%" textAlign="center" p={1}>
                  {day && (
                    <Button
                      size="sm"
                      width="full"
                      variant={
                        selectedDate &&
                        day.toDateString() === selectedDate.toDateString()
                          ? "solid"
                          : "ghost"
                      }
                      colorScheme={
                        selectedDate &&
                        day.toDateString() === selectedDate.toDateString()
                          ? "blue"
                          : "gray"
                      }
                      onClick={() =>
                        isDateSelectable(day) && handleDateSelect(day)
                      }
                      isDisabled={!isDateSelectable(day)}
                    >
                      {day.getDate()}
                    </Button>
                  )}
                </Box>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedDate(null);
                onChange?.(null);
                onClose();
              }}
            >
              Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
