export function numberToOrdinal(num) {
  const specialCases = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
    10: "Tenth",
    11: "Eleventh",
    12: "Twelfth",
    13: "Thirteenth",
    14: "Fourteenth",
    15: "Fifteenth",
    16: "Sixteenth",
    17: "Seventeenth",
    18: "Eighteenth",
    19: "Nineteenth",
  };

  const tensCases = {
    20: "Twentieth",
    30: "Thirtieth",
    40: "Fortieth",
    50: "Fiftieth",
    60: "Sixtieth",
    70: "Seventieth",
    80: "Eightieth",
    90: "Ninetieth",
  };

  // Handle special cases
  if (specialCases[num]) {
    return specialCases[num];
  }

  // Handle tens cases
  if (tensCases[num]) {
    return tensCases[num];
  }

  // Calculate the last digit and the tens
  const lastDigit = num % 10;
  const tens = num - lastDigit;

  // English suffixes for ordinal numbers
  const suffixes = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
  };

  // If it's a multiple of ten, check the tens case
  if (suffixes[lastDigit]) {
    return tensCases[tens]
      ? tensCases[tens].replace("ieth", "y") + "-" + suffixes[lastDigit] // Convert "Thirtieth" to "Thirty" and add suffix
      : suffixes[lastDigit];
  }

  // Default case for numbers 21+
  const ordinalSuffix = (n) => {
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${n}th`;
    }
    switch (lastDigit) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  return ordinalSuffix(num);
}
