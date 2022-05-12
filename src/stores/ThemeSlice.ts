import { createSlice } from "@reduxjs/toolkit";

const initialState = 'light';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state): string {
      return state === 'light' ? 'dark' : 'light';
    }
  }
});
interface IReduxState {
  theme: string;
}
export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state: IReduxState) => state.theme;
export default themeSlice.reducer;
