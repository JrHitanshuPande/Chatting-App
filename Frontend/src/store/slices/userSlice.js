import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    name: "",
    email: "",
    token: "",
    userId: "",
}

const userSlice = createSlice(
    {
        name: "user",
        initialState,
        reducers: {
            login: (state, action) => {
                const user = action.payload
                state.name = user.name;
                state.email = user.email;
                state.token = user.token;
                state.userId = user.userId;
            },
            logout: (state) => {
                state.name = "";
                state.email = "";
                state.token = "";
                state.userId = "";
            },
            refreshtoken: (state, action) => {
                state.token = action.payload;
            }
        }
    }
)

export const { login, logout, refreshtoken } = userSlice.actions;
export default userSlice.reducer;