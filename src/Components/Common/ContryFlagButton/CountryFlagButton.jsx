import React, { useState, useEffect } from "react";
import { Button, Image, Spinner, Skeleton } from "@chakra-ui/react";
import axios from "axios";

export const CountryFlagButton = ({
  countryCode,
  onClick,
  viewName = () => {},
  ...rest
}) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (countryCode) {
      axios
        .get(
          `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,flags`
        )
        .then((response) => {
          setCountry({
            name: response.data.name.common,
            flag: response.data.flags.svg,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [countryCode]);

  if (loading) {
    return (
      <Skeleton borderRadius="md" isLoaded={!loading}>
        <Button isLoading />
      </Skeleton>
    );
  }

  if (!country) {
    return <Button>No Country</Button>;
  }

  return (
    <Button {...rest} gap="4" onClick={onClick} p={1} variant="ghost">
      <Image src={country.flag} alt={country.name} boxSize="20px" />
      {viewName(country?.name)}
    </Button>
  );
};
