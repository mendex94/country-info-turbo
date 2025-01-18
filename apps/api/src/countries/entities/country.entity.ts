export class Country {
  countryCode: string;
  commonName: string;
  officialName: string;
}

export class PopulationCount {
  year: number;
  value: number;
}

export class DetailedCountry extends Country {
  populationCounts: PopulationCount[];
  flagUrl: string;
  borders: Country[];
}
