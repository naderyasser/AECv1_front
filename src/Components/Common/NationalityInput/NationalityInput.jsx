import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";

export const NationalityInput = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const observer = useRef(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      .then((response) => {
        const sortedCountries = response.data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags.svg,
            code: country.cca2.toLowerCase(),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    setVisibleCount(10); // Reset visible count when searching
  }, [search, countries]);

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + 10, filteredCountries.length)
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, filteredCountries.length]
  );

  const selectedCountry = countries.find((c) => c.code === value);

  return (
    <Menu>
      <Skeleton borderRadius="md" isLoaded={!loading}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          w="100%"
          textAlign="left"
        >
          <Flex align="center" gap={2}>
            {selectedCountry ? (
              <>
                <Image
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  boxSize="20px"
                />
                <Text>{selectedCountry.name}</Text>
              </>
            ) : (
              "Select Nationality"
            )}
          </Flex>
        </MenuButton>
      </Skeleton>

      <MenuList maxH="300px" overflowY="auto" p="2">
        <Input
          placeholder="Search nationality..."
          mb="2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <Flex justify="center" p="2">
            <Spinner />
          </Flex>
        ) : (
          filteredCountries.slice(0, visibleCount).map((country, index) => (
            <MenuItem
              key={country.code}
              onClick={() => onChange(country.code)}
              ref={index === visibleCount - 1 ? lastItemRef : null}
            >
              <Flex align="center" gap={2}>
                <Image src={country.flag} alt={country.name} boxSize="20px" />
                <Text>{country.name}</Text>
              </Flex>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
};
