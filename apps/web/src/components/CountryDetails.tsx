"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DetailedCountry } from "@/@types/country";

interface CountryDetailsProps {
  country: DetailedCountry;
}

export default function CountryDetails({ country }: CountryDetailsProps) {
  const [populationData] = useState(() => {
    return country.populationCounts?.map((data) => ({
      year: data.year,
      population: data.value,
    }));
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{country.officialName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Image
            src={country.flagUrl ?? ""}
            alt={`Flag of ${country.commonName}`}
            width={300}
            height={200}
            className="rounded-md shadow-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Country Information</h2>
            <p>
              <strong>Region:</strong> {country.region}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Bordering Countries</h2>
            {country.borders ? (
              <div className="flex flex-wrap gap-2">
                {country.borders.map((border) => (
                  <Link
                    key={border.countryCode}
                    href={`/country/${border.countryCode}`}
                  >
                    <Button variant="outline" size="sm">
                      {border.countryCode}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No bordering countries</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Population Trend (Estimated)
          </h2>
          <ChartContainer
            config={{
              population: {
                label: "Population",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={populationData}>
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="population"
                  stroke="var(--color-population)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
