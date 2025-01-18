import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CountryCardProps {
  name: string;
  countryCode: string;
}

export default function CountryCard({ name, countryCode }: CountryCardProps) {
  return (
    <Link href={`/country/${countryCode}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">{name}</h2>
        </CardContent>
      </Card>
    </Link>
  );
}
