import CountryDetails from "@/components/CountryDetails";
import { getCountryByCode } from "@/lib/api";

export default async function CountryPage(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;
  const country = await getCountryByCode(params.code);

  return (
    <div className="container mx-auto p-4">
      <CountryDetails country={country} />
    </div>
  );
}
