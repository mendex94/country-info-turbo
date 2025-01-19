import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, forkJoin, map, Observable, switchMap } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  Country,
  DetailedCountry,
  PopulationCount,
} from './entities/country.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CountriesService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  findAll(): Observable<Country[]> {
    const url = `${this.configService.get<string>('NAGER_AT_API_BASE_URL')}/AvailableCountries`;
    return this.httpService.get<Country[]>(url).pipe(
      map((response: AxiosResponse<Country[]>) => response.data),
      catchError((error) => {
        throw new HttpException(
          'Error fetching countries: ' + error.message,
          500,
        );
      }),
    );
  }

  findOne(id: string): Observable<DetailedCountry> {
    const detailedCountryURL = `${this.configService.get<string>('NAGER_AT_API_BASE_URL')}/CountryInfo/${id}`;
    const countryPopulationURL = `${this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL')}/countries/population`;
    const countryFlagURL = `${this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL')}/countries/flag/images`;

    const detailedCountry$ = this.httpService
      .get<DetailedCountry>(detailedCountryURL)
      .pipe(
        map((response: AxiosResponse<DetailedCountry>) => response.data),
        catchError((error) => {
          throw new HttpException(
            'Error fetching country: ' + error.message,
            500,
          );
        }),
      );

    return detailedCountry$.pipe(
      switchMap((detailedCountry) =>
        forkJoin({
          populationCounts: this.httpService
            .post<{ data: { populationCounts: PopulationCount[] } }>(
              countryPopulationURL,
              {
                country: detailedCountry.commonName,
              },
            )
            .pipe(
              map(
                (
                  response: AxiosResponse<{
                    data: { populationCounts: PopulationCount[] };
                  }>,
                ) => response.data.data.populationCounts,
              ),
              catchError((error) => {
                throw new HttpException(
                  'Error fetching population: ' + error.message,
                  500,
                );
              }),
            ),
          flagUrl: this.httpService
            .post<{ data: { flag: string } }>(countryFlagURL, {
              iso2: detailedCountry.countryCode,
            })
            .pipe(
              map(
                (response: AxiosResponse<{ data: { flag: string } }>) =>
                  response.data.data.flag,
              ),
              catchError((error) => {
                throw new HttpException(
                  'Error fetching flag: ' + error.message,
                  500,
                );
              }),
            ),
        }).pipe(
          map(({ populationCounts, flagUrl }) => ({
            ...detailedCountry,
            populationCounts,
            flagUrl,
          })),
        ),
      ),
    );
  }
}
