import { configureStore, compose } from "@reduxjs/toolkit";
import loaderSlice from "../redux/features/loading-slice";
import editorSlice from "../redux/features/editor-slice";
import userSlice from "../redux/features/user-slice";
import reviewerSlice from "../redux/features/reviewer-slice";
import associateSlice from "./features/associate-slice";
import authorSubmittedPaperReducer from "./features/submitted-paper"
import journalReducer from "./features/journal-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import thunk  from "redux-thunk";

export const store = configureStore({
  reducer: {
    loaderSlice,
    userSlice,
    editorSlice,
    reviewerSlice,
    associateSlice,
    authorSubmittedPaper: authorSubmittedPaperReducer,
    journal: journalReducer,
  },
  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type useDispatch = typeof store.dispatch;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;