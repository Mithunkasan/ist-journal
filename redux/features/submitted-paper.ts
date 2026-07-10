import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState={
    value:{
        authorSubmittedData:[],
    }
}

export const authorSubmittedPaperData=createSlice({
    name:"authorSubmittedPaper",
    initialState,
    reducers:{
        authorSubmittedPaper:(state,action:PayloadAction<any>)=>{
            state.value.authorSubmittedData=action.payload

        }
    }
})

export const {authorSubmittedPaper}=authorSubmittedPaperData.actions;

export default authorSubmittedPaperData.reducer;