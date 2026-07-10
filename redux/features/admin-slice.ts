import { JournalPaperType } from "@/types/Journals/author";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: UserState;
};

type UserState = {
  journalPaper: JournalPaperType | null;
};

const initialState = {
  value: {
    journalPaper: null,
  } as UserState,
} as InitialState;

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getJournalData: (state, action: PayloadAction<any>) => {
      state.value.journalPaper = action.payload;
    },
  },
});

export const { getJournalData } = adminSlice.actions;

export default adminSlice.reducer;
