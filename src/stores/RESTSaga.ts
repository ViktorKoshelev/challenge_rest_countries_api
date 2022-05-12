import { call, CallEffect, put, PutEffect, takeEvery } from 'redux-saga/effects'
import { ActionCreatorWithPayload, createAction, PayloadAction } from '@reduxjs/toolkit';
import * as RESTSlice from './RESTSlice';

const { setLoading, setError } = RESTSlice;
type Callback = keyof typeof RESTSlice;
export const load = createAction<{ query: string, putCallback: Callback }>('load');

export const DEFAULT_ENDPOINT = 'https://restcountries.com/v3.1';
export const getAll = () => load({
  query: '/all',
  putCallback: 'setLists'
});
export const getAllCountries = () => load({
  query: '/all',
  putCallback: 'setAllCountries'
});
export const getRegion = (region: string) => load({
  query: '/region/' + region,
  putCallback: 'setCountryList'
});
export const search = (searchQuery: string) => {
  if (!searchQuery) {
    return getAll();
  }
  return load({
    query: '/name/' + searchQuery,
    putCallback: 'setCountryList'
  })
}
  ;
export const getCountry = (countryCode?: string) => load({
  query: '/alpha/' + countryCode,
  putCallback: 'setCountryList'
})

function* RESTWorker(action: PayloadAction<{ query: string; putCallback: Callback }>): Generator<CallEffect | PutEffect> {
  const { payload } = action;
  const { query, putCallback } = payload
  yield put(setLoading(true));
  try {
    const response = (yield call(() => fetch(DEFAULT_ENDPOINT + query))) as Response;
    const action = (RESTSlice[putCallback] as ActionCreatorWithPayload<object[]>);
    if (!response.ok) {
      if (response.status === 404) {
        yield put(action([]));
      } else {
        throw (yield call(() => response.json())) as Error;
      }
    } else {
      const countries = (yield call(() => response.json())) as object[];
      yield put(action(countries));
    }
  } catch (e) {
    yield put(setError(e as Error));
  } finally {
    yield put(setLoading(false));
  }
}

export function* RESTSaga() {
  yield takeEvery(load.type, RESTWorker);
}
