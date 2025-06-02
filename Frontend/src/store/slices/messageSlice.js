import { createSlice } from "@reduxjs/toolkit";

const userMessage = createSlice(
    {
        name: "usermessage",
        initialState: {
            selectedUser: null,
            messages: [],
        },
        reducers: {
            setselectedUser: (state, action) => {
                state.selectedUser = action.payload;
            },
            logoutMessage: (state) => {
                state.selectedUser = null;
                state.messages = [];
            },
        }
    }
)
export const { setselectedUser, logoutMessage } = userMessage.actions;
export default userMessage.reducer; 