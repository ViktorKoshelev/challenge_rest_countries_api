import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IState {
  isLoading: boolean;
  countryList: Record<string, any>[];
  allCountries: Record<string, any>[];
  error: Error | null;
}
const initialState: IState = {
  isLoading: false,
  countryList: [],
  allCountries: [],
  error: null
};

const RESTSlice = createSlice({
  name: 'REST',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>): void {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<Error>): void {
      state.error = action.payload;
    },
    setCountryList(state, action: PayloadAction<IState['countryList']>): void {
      state.countryList = action.payload;
    },
    setAllCountries(state, action: PayloadAction<IState['allCountries']>): void {
      state.allCountries = action.payload;
    },
    setLists(state, action: PayloadAction<IState['allCountries']>): void {
      state.allCountries = action.payload;
      state.countryList = action.payload;
    }
  }
});
interface IReduxState { REST: IState; }
export const selectREST = (state: IReduxState): IState => state.REST;
export const selectIsAll = (state: IReduxState): boolean => {
  const { allCountries, countryList } = selectREST(state);
  return allCountries === countryList;
};
export const selectIsEmptyCountryList = (state: IReduxState): boolean => {
  const { countryList, isLoading } = selectREST(state);
  return !countryList.length && !isLoading;
}

export const getCountryByCode = (state: IState, code?: string): Record<string, any> | void => state.allCountries.find(({ cca3 }: any) => cca3 === code);


const { actions } = RESTSlice;
export const { setLoading, setError, setCountryList, setAllCountries, setLists } = actions;
export default RESTSlice.reducer;

