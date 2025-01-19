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
    const { detailedCountryURL, countryPopulationURL, countryFlagURL } =
      this.getBaseURLs();

    const detailedCountry$ = this.getDetailedCountry(detailedCountryURL, id);

    return detailedCountry$.pipe(
      switchMap((detailedCountry) =>
        forkJoin({
          populationCounts: this.getCountryPopulation(
            countryPopulationURL,
            detailedCountry.commonName,
          ),
          flagUrl: this.getCountryFlag(
            countryFlagURL,
            detailedCountry.countryCode,
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

  private getBaseURLs() {
    return {
      detailedCountryURL: `${this.configService.get<string>('NAGER_AT_API_BASE_URL')}/CountryInfo`,
      countryPopulationURL: `${this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL')}/countries/population`,
      countryFlagURL: `${this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL')}/countries/flag/images`,
    };
  }

  private getDetailedCountry(
    url: string,
    id: string,
  ): Observable<DetailedCountry> {
    return this.httpService.get<DetailedCountry>(`${url}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.handleHttpError('country', error)),
    );
  }

  private getCountryPopulation(
    url: string,
    countryName: string,
  ): Observable<PopulationCount[]> {
    return this.httpService
      .post<{
        data: { populationCounts: PopulationCount[] };
      }>(url, { country: countryName })
      .pipe(
        map((response) => response.data.data.populationCounts),
        catchError((error) => this.handleHttpError('population', error)),
      );
  }

  private getCountryFlag(url: string, countryCode: string): Observable<string> {
    return this.httpService
      .post<{ data: { flag: string } }>(url, { iso2: countryCode })
      .pipe(
        map((response) => response.data.data.flag),
        catchError((error) => this.handleHttpError('flag', error)),
      );
  }

  private handleHttpError(resource: string, error: any): never {
    throw new HttpException(
      `Error fetching ${resource}: ${error.message}`,
      500,
    );
  }
}
