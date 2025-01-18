import { Country, DetailedCountry } from "@/@types/country";

export async function getAllCountries(): Promise<Country[]> {
  const response = await fetch(`${process.env.API_URL}/countries`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
}

export async function getCountryByCode(code: string): Promise<DetailedCountry> {
  const response = await fetch(`${process.env.API_URL}/countries/${code}`);
  if (!response.ok) {
    throw new Error("Failed to fetch country");
  }
  return response.json();
}
