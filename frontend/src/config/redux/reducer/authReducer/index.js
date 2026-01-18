import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../action/authAction";


const initialState = {
    user: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    LoadingIn:false,
    message: "",
   profileFetched:false,
   connections:[],
   connectionRequests:[],
   
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducer:{
        reset:()=>initialState,
        handleLoginuser:(state)=>{
            state.message="hello"
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading = true,
            state.message="Knocking the door..."
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError=false,
            state.isSuccess=true,
            state.loginIn=true,
            state.message="login is Succesfull"
        })
         .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError=true,
            state.message=action.payload
         })
         .addCase(registerUser.pending,(state)=>{
            state.isLoading = true,
            state.message="Registering you..."
         })
         .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError=false,
            state.isSuccess=true,
            state.loginIn=true,
            state.message="login is Succesfull"
         })
         .addCase (registerUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError=true,
            state.message=action.payload
         })
    }
})


export default authSlice.reducer
