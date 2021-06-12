import { createSlice } from '@reduxjs/toolkit';

export const GlobalSlice = createSlice({
  name: 'global',
  initialState: {
    loading: false,
    progressBarLoading: false,
  },
  reducers: {
    toggleLoading: state => {
      state.loading = !state.loading;
    },
    toggleProgressBarLoading: state => {
      state.progressBarLoading = !state.progressBarLoading;
    },
  },
});

export const { toggleLoading, toggleProgressBarLoading } = GlobalSlice.actions;

export const selectLoading = (state: any) => state.loading;
export const selectProgressBarLoading = (state: any) => state.progressBarLoading;

export default GlobalSlice.reducer;
