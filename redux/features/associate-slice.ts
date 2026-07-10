import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: AssociateState;
};

type AssociateState = {
  associateData: any;
};

const initialState = {
  value: {
    associateData: null,
  } as AssociateState,
} as InitialState;

export const associateSlice = createSlice({
  name: "associate",
  initialState,
  reducers: {
    getAssociateData: (state, action: PayloadAction<any>) => {
      state.value.associateData = action.payload;
    },
  },
});

export const { getAssociateData } = associateSlice.actions;

export default associateSlice.reducer;
