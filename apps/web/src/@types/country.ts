export type Country = {
  countryCode: string;
  name: string;
};

export type PopulationCount = {
  year: number;
  value: number;
};

export type DetailedCountry = {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  populationCounts?: PopulationCount[];
  flagUrl?: string;
  borders: DetailedCountry[] | null;
};
