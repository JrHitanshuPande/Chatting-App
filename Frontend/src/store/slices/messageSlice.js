import { createSlice } from "@reduxjs/toolkit";

const userMessage = createSlice(
    {
        name: "usermessage",
        initialState: {
            selectedUser: null,
            messages: [],
        },
        reducers: {
            setselectedUser : (state, action) => {
                state.selectedUser = action.payload;
            }
        }
    }
)
export const { setselectedUser } = userMessage.actions;
export default userMessage.reducer; 