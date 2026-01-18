import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser } from "../../action/authAction";

const initialState = {
    user: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    LoggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginuser: (state) => {
            state.message = {
                message: "hello"
            }
        }, emptyMessage: (state) => {
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true,
                state.message = {
                    message: "Knocking the door..."
                }
        })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.isSuccess = true,
                    state.LoggedIn = true,
                    state.message = {
                        message: "Login Successful",
                    }
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.isSuccess = true,
                    state.message = {
                        message: "Registeration is Succesfull, Please log-in     "
                    }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isError = true,
                    state.message = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true,
                    state.message = {
                        message: "Registering you..."
                    }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isError = true,
                    state.message = action.payload
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.profileFetched = true,
                    state.user = action.payload
            })

    }
})


export const { reset, emptyMessage } = authSlice.actions
export default authSlice.reducer
