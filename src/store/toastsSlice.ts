import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type Toast = {
    id: string;
    message: string;
    tone: "success" | "error";
};

const initialState: Toast[] = [];

const toastsSlice = createSlice({
    name: "toasts",
    initialState,
    reducers: {
        toastDismissed: (state, action: PayloadAction<string>) => state.filter((toast) => toast.id !== action.payload),
        toastAdded: {
            prepare: (message: string, tone: Toast["tone"]) => ({
                payload: { id: nanoid(), message, tone }
            }),
            reducer: (state, action: PayloadAction<Toast>) => {
                state.push(action.payload);
            }
        }
    }
});

export const { toastAdded, toastDismissed } = toastsSlice.actions;
export default toastsSlice.reducer;
