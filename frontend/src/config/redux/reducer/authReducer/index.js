import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUsers } from "../../action/authAction";

const initialState = {
    user: undefined,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isTokenThere: false,
    LoggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_users: [],
    all_profiles_fetched: false,

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset:() => initialState,
        handleLoginuser: (state) => {
            state.message = {
                message: "hello"
            }
        },
         emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
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
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.all_profiles_fetched = true,
                    state.all_users = action.payload.profiles
            })

    }
})


export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions
export default authSlice.reducer
