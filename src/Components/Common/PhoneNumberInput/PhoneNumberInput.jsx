import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";

// Country codes mapping
const countryCodes = {
  EG: "+20",
  US: "+1",
  GB: "+44",
  DE: "+49",
  FR: "+33",
  IT: "+39",
  ES: "+34",
  // Add more country codes as needed
};

export const PhoneInput = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const observer = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd"
        );
        const data = await response.json();
        const sortedCountries = data
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((country) => ({
            name: country.name.common,
            flag: country.flags.svg,
            code: country.cca2,
            dialCode: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : countryCodes[country.cca2] || "",
          }));
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        // Set default country to US
        const us = sortedCountries.find((country) => country.code === "US");
        setSelectedCountry(us);
      } catch (error) {
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setVisibleCount(20);
  }, [searchQuery, countries]);

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredCountries.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + 20, filteredCountries.length)
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, filteredCountries.length, visibleCount]
  );

  const formatPhoneNumber = (value, country) => {
    // Remove any existing country code and non-digit characters
    let digits = value.replace(/\D/g, "");

    // If the input starts with the country code, remove it
    if (country?.dialCode) {
      const dialCode = country.dialCode.replace("+", "");
      if (digits.startsWith(dialCode)) {
        digits = digits.slice(dialCode.length);
      }
    }

    // US format: (XXX) XXX-XXXX
    if (country?.code === "US") {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }

    // Default international format: XXX XXX XXXX
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, "");

    if (digits.length > 15) {
      setError("Phone number is too long");
      return;
    }

    setError("");
    const formattedNumber = formatPhoneNumber(input, selectedCountry);
    // Always include the country code in the final value
    onChange(
      selectedCountry?.dialCode
        ? `${selectedCountry.dialCode} ${formattedNumber}`
        : formattedNumber
    );
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    // Reformat the existing number with the new country code
    if (value) {
      const strippedNumber = value.replace(/\D/g, "");
      const formattedNumber = formatPhoneNumber(strippedNumber, country);
      onChange(country.dialCode ? `${country.dialCode}` : formattedNumber);
    }
  };

  return (
    <Box maxW="md" w="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!error}>
          <FormLabel>Phone Number</FormLabel>

          <Flex gap={2}>
            <Menu>
              <Skeleton isLoaded={!loading} borderRadius="md">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  w="120px"
                  variant="outline"
                >
                  {selectedCountry ? (
                    <Flex align="center">
                      <Image
                        src={selectedCountry.flag}
                        alt={`${selectedCountry.name} flag`}
                        boxSize="4"
                        objectFit="contain"
                        mr={2}
                      />
                      <Text fontSize="sm">{selectedCountry.dialCode}</Text>
                    </Flex>
                  ) : (
                    "Select..."
                  )}
                </MenuButton>
              </Skeleton>

              <MenuList maxH="300px" overflowY="auto">
                <Box px={4} py={2}>
                  <Input
                    placeholder="Search countries..."
                    size="sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Box>
                {loading ? (
                  <Flex justify="center" p={4}>
                    <Spinner />
                  </Flex>
                ) : (
                  filteredCountries
                    .slice(0, visibleCount)
                    .map((country, index) => (
                      <MenuItem
                        key={country.code}
                        onClick={() => handleCountryChange(country)}
                        ref={index === visibleCount - 1 ? lastItemRef : null}
                      >
                        <Flex align="center">
                          <Image
                            src={country.flag}
                            alt={`${country.name} flag`}
                            boxSize="4"
                            objectFit="contain"
                            mr={2}
                          />
                          <Text>{country.name}</Text>
                          <Text ml="auto" color="gray.500">
                            {country.dialCode}
                          </Text>
                        </Flex>
                      </MenuItem>
                    ))
                )}
              </MenuList>
            </Menu>

            <FormControl isInvalid={!!error} flex={1}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PhoneIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  type="tel"
                  placeholder={
                    selectedCountry?.code === "US"
                      ? "(555) 555-5555"
                      : "123 456 7890"
                  }
                  value={value || ""}
                  onChange={handlePhoneChange}
                  isDisabled={!selectedCountry || loading}
                  pl={10}
                />
              </InputGroup>
            </FormControl>
          </Flex>

          {error && <FormErrorMessage>{error}</FormErrorMessage>}

          <FormHelperText>
            {loading ? (
              <Flex align="center">
                <Spinner size="xs" mr={2} />
                Loading countries...
              </Flex>
            ) : selectedCountry ? (
              `Enter a phone number for ${selectedCountry.name} (${selectedCountry.dialCode})`
            ) : (
              "Select a country to enter phone number"
            )}
          </FormHelperText>
        </FormControl>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </VStack>
    </Box>
  );
};
