// journalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JournalState {
  assignedJournals: any[];
}

const initialState: JournalState = {
  assignedJournals: [],
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setAssignedJournals(state, action: PayloadAction<any[]>) {
      state.assignedJournals = action.payload;
    },
  },
});

export const { setAssignedJournals } = journalSlice.actions;
export default journalSlice.reducer;
