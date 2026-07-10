import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: LoaderState;
};

type LoaderState = {
  isLoading: boolean;
  data: any;
  error: any;
};

const initialState = {
  value: {
    isLoading: false,
    data: null,
    error: null,
  } as LoaderState,
} as InitialState;

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      (state as InitialState).value.isLoading = action.payload;
    },
    clearError: (state) => {
      (state as InitialState).value.error = null;
    },
    setError: (state, action: PayloadAction<any>) => {
      (state as InitialState).value.error = action.payload;
    },
  },
});

export const { setLoading, clearError, setError } = loaderSlice.actions;

export default loaderSlice.reducer;
