// utils/countryCodeConverter.js

import countryList from "country-list";

interface Country {
  code: string;
  name: string;
}

const GetCountryCode = (countryName: string): string | null => {
  const countries: Country[] = countryList.getData();
  const country: Country | undefined = countries.find(
    (c: Country) => c.name === countryName
  );

  return country ? country.code : null;
};

export default GetCountryCode;
