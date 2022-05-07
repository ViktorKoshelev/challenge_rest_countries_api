import RESTStore, { DEFAULT_ENDPOINT } from '../stores/RESTStore';
type Fetch = jest.MockedFunction<typeof fetch>;

let isReject = false;
//@ts-ignore
global.fetch = jest.fn(() =>
  isReject
    ? Promise.resolve({ ok: false, json: async () => ({ message: 'error' }) })
    : Promise.resolve({ ok: true, json: async () => ([]) })
);

const GET_URL = (path: string) => DEFAULT_ENDPOINT + path;

let store: RESTStore;
let spy: ReturnType<typeof jest.spyOn>;

beforeAll(() => {
  spy = jest.spyOn(global, 'fetch');
})

afterAll(() => {
  // afterAll
  jest.restoreAllMocks();
  spy.mockRestore();
})

beforeEach(() => {
  spy.mockClear();
  store = new RESTStore();
})

it('returns empty countries list after creation', async () => {
  expect.assertions(2);
  expect(store.countryList).toEqual([]);
  await store.getAllCountries();
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/all'));
})

it('set search to query', async () => {
  expect.assertions(1);
  const country = 'Germany'
  store.search = country;
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/name/' + country));
})

it('set region to query', async () => {
  expect.assertions(1);
  const region = 'Asia';
  store.region = region;
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/region/' + region));
})

it('is change loading state', async () => {
  expect.assertions(3);
  const promise = store.getAllCountries();
  expect(store.isLoading).toBe(true);

  await promise;
  expect(store.error).toBeFalsy();
  expect(store.isLoading).toBe(false);
})

it('is save error', async () => {
  expect.assertions(2);
  isReject = true;

  await store.getAllCountries();

  expect(store.error?.message).toBe('error');

  expect(store.isLoading).toBe(false);
  isReject = false;
})

it('reset search', async () => {
  expect.assertions(2);
  const country = 'Germany'
  store.search = country;
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/name/' + country));
  store.search = '';
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/all'));
})

it('is loading country', async () => {
  expect.assertions(1);
  const country = 'URY'
  store.country = country;
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/alpha/' + country));
})

it('reset country', async () => {
  expect.assertions(2);
  const country = 'URY';
  store.country = country;
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/alpha/' + country));
  store.country = '';
  expect(spy).toHaveBeenLastCalledWith(GET_URL('/all'));
})

it('get all dont rewrite country list for one', async () => {
  expect.assertions(1);
  store.country = 'URY';
  const countryList = await store.getAllCountries() as unknown as object[];
  expect(store.countryList !== countryList).toBeTruthy();
})
