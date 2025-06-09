import { languages } from "../../../~Data/Languages";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Input,
  VStack,
  HStack,
  Image,
  Text,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { MdLanguage } from "react-icons/md";
import { ErrorText } from "../ErrorText/ErrorText";

export const LanguageSelect = ({ control, name, error, defaultValue }) => {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  // Initialize selectedLanguage with defaultValue if provided
  useEffect(() => {
    if (defaultValue) {
      const language = languages.find((lang) => lang.code === defaultValue);
      if (language) {
        setSelectedLanguage(language);
      }
    }
  }, [defaultValue]);

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Set the initial value from defaultValue
          useEffect(() => {
            if (defaultValue && !field.value) {
              field.onChange(defaultValue);
            }
          }, []);

          return (
            <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <PopoverTrigger>
                <Button
                  justifyContent="start"
                  variant="outline"
                  w="full"
                  gap="3"
                  alignItems="center"
                  size="lg"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <MdLanguage />
                  {selectedLanguage ? (
                    <HStack>
                      <Image
                        src={selectedLanguage.flag}
                        alt={selectedLanguage.name}
                        boxSize="20px"
                      />
                      <Text>{selectedLanguage.name}</Text>
                    </HStack>
                  ) : (
                    "Select a Language"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody maxH="350px" overflow="auto">
                  <Text p="1">Select A Language</Text>
                  <Divider my="3" />
                  <Input
                    placeholder="Search language..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    pos="sticky"
                    top="0"
                    zIndex="1000"
                    bgColor="white"
                    variant="outline"
                    mb="3"
                  />
                  <VStack align="stretch">
                    {filteredLanguages.map((lang) => (
                      <HStack
                        key={lang.code}
                        onClick={() => {
                          field.onChange(lang.code);
                          setSelectedLanguage(lang);
                          setIsOpen(false); // Close popover after selection
                        }}
                        cursor="pointer"
                        p={2}
                        _hover={{ bg: "gray.100" }}
                      >
                        <Image src={lang.flag} alt={lang.name} boxSize="20px" />
                        <Text>{lang.name}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      <ErrorText>{error}</ErrorText>
    </Box>
  );
};
