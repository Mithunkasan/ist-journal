import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: EditorState;
};

type EditorState = {
  editorData: any;
};

const initialState = {
  value: {
    editorData: null,
    // foodData: null,
    // distributor: null,
    // foodRequest: null,
  } as EditorState,
} as InitialState;

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    getEditorData: (state, action: PayloadAction<any>) => {
      state.value.editorData = action.payload;
    },

    // setFood: (state, action: PayloadAction<any>) => {
    //   state.value.foodData = action.payload;
    // },
    // setDistributor: (state, action: PayloadAction<any>) => {
    //   state.value.foodData = action.payload;
    // },
    // setFoodRequest: (state, action: PayloadAction<any>) => {
    //   state.value.foodRequest = action.payload;
    // },
    // clearUser: (state) => {
    //   state.value = {
    //     userData: null,
    //     foodData: null,
    //     distributor: null,
    //     foodRequest: null,
    //   };
    // },
  },
});

export const { getEditorData } = editorSlice.actions;

export default editorSlice.reducer;
