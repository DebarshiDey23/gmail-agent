import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    email: string | null;
    loggedIn: boolean;
}

const initialState: UserState = {
    email: null,
    loggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ email: string }>) => {
            state.email = action.payload.email;
            state.loggedIn = true;
        },
        logout: (state) => {
            state.email = null;
            state.loggedIn = false;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
