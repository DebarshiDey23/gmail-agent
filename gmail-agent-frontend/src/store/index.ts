// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // example slice

export const store = configureStore({
    reducer: {
        user: userReducer, // must be an object with reducers
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
