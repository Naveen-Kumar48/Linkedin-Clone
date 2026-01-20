
import { createSlice } from "@reduxjs/toolkit";
import { getAllPost } from "../../action/postAction";

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    isSuccess: false,
    message: "",
    comments:[],
    postId:"",
    
}   

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        }
        
        
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPost.pending,(state)=>{
            state.isLoading=true,
            state.message= "Fetching all the posts..."
        })
        .addCase(getAllPost.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.isError=false, 
            state.postFetched=true,
            state.posts=action.payload.posts.reverse(),
            state.message="Posts fetched successfully"
        })
        .addCase(getAllPost.rejected,(state,action)=>{
            state.isLoading=false,
            state.isError=true,
            state.postFetched=false,
            state.message=action.payload
        })
    }
})

export const {reset,resetPostId}=postSlice.actions
export default postSlice.reducer