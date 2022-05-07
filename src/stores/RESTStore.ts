import { makeAutoObservable, flowResult } from 'mobx';
import { CancellablePromise } from 'mobx/dist/internal';

/**
 * Load and saves data from Countries REST API
 */
const DEFAULT_PATH = '/all';
export const DEFAULT_ENDPOINT = 'https://restcountries.com/v3.1';
export default class RESTStore {
  private endpoint: string = DEFAULT_ENDPOINT;
  countryList: Record<string, any>[] = [];
  allCountries: Record<string, any>[] = [];
  isLoading: boolean = false;
  error: Error | null = null;

  constructor(endpoint?: string) {
    this.endpoint = endpoint || this.endpoint;
    makeAutoObservable(this, {}, { autoBind: true });
    this.getAllCountries();
  }

  private *load(query: string): Generator<Promise<Response | object[]>, object[] | void, Response | object[]> {
    this.isLoading = true;
    try {
      const response = (yield fetch(this.endpoint + query)) as Response;
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        } else {
          throw yield response.json();
        }
      } else {
        const countries = (yield response.json()) as object[];
        return countries;
      }
    } catch (e) {
      this.error = e as Error;
    } finally {
      this.isLoading = false;
    }
  }

  getAllCountries(): Promise<void | object[]> {
    return flowResult(this.getAll());
  }

  private *getAll(): Generator<CancellablePromise<object[] | void>, object[], void> {
    if (this.allCountries.length) {
      return this.allCountries;
    }

    const countries: (object[] | void) = yield flowResult(this.load(DEFAULT_PATH));
    if (Array.isArray(countries) && countries.length) {
      this.allCountries = countries;
    }
    return this.allCountries;
  }

  getCountryByCode(code: string): object {
    return this.allCountries.find(({ cca3 }: any) => cca3 === code) || {};
  }

  setCountryList(list: object[] | void): void {
    if (!list) {
      return;
    }
    this.countryList = list;
  }

  set search(name: string) {
    if (!name) {
      this.getAllCountries()
        .then(this.setCountryList);
      return;
    }
    flowResult(this.load(`/name/${name}`))
      .then(this.setCountryList);
  }

  set region(region: string) {
    flowResult(this.load(`/region/${region}`))
      .then(this.setCountryList);
  }

  set country(country: string | undefined) {
    if (this.countryList?.length && this.countryList[0].cca3 === country) {
      return;
    }
    if (!country) {
      this.getAllCountries()
        .then(this.setCountryList);
      return;
    }
    flowResult(this.load(`/alpha/${country}`))
      .then(this.setCountryList);
  }

  get isEmptyCountryList(): boolean {
    return !this.countryList.length && !this.isLoading;
  }
}
