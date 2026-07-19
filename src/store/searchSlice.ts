import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SearchMode = "symptom" | "name";

type SearchState = {
    mode: SearchMode;
    query: string;
    session: number;
};

const initialState: SearchState = {
    mode: "symptom",
    query: "",
    session: 0
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        modePicked: (state, action: PayloadAction<SearchMode>) => {
            state.mode = action.payload;
        },
        queryTyped: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        searchCleared: (state) => {
            state.session += 1;
        }
    }
});

export const { modePicked, queryTyped, searchCleared } = searchSlice.actions;
export default searchSlice.reducer;
