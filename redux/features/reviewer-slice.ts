// redux/reviewerSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Reviewer = {
  id: string;
  name: string;
  email: string;
  areaOfExpertise?: string;
};

type ReviewState = {
  reviewerData: Reviewer[] | null;
};

type InitialState = {
  value: ReviewState;
};

const initialState: InitialState = {
  value: {
    reviewerData: null,
  },
};

export const reviewerSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    getReviewerData: (state, action: PayloadAction<Reviewer[] | null>) => {
      state.value.reviewerData = action.payload;
    },
  },
});

export const { getReviewerData } = reviewerSlice.actions;

export default reviewerSlice.reducer;
