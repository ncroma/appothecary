import { configureStore } from "@reduxjs/toolkit";
import toastsReducer from "./toastsSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            toasts: toastsReducer
        }
    });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
