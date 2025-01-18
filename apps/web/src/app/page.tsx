import CountryCard from "@/components/CountryCard";
import { getAllCountries } from "@/lib/api";

export default async function Home() {
  const countries = await getAllCountries();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Countries of the World</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <CountryCard
            key={country.countryCode}
            name={country.name}
            countryCode={country.countryCode}
          />
        ))}
      </div>
    </div>
  );
}
