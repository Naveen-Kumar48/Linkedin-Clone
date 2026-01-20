import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";





export const getAllPost = createAsyncThunk(
    "post/getAllPost",
    async (_, thunkAPI) => {

        try {
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    })
//* function for the create post
export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;
        try {
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'));
            formData.append("body", body);
            formData.append("media", file);
            const response = await clientServer.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(response.data);
            } else {
                return thunkAPI.rejectWithValue("Post Not Uploaded");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    })


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postData, thunkAPI) => {
        const { postId, token } = postData;
        try {
            const response = await clientServer.delete('/delete_post', {
                data: {
                    token: token,
                    post_id: postId
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong");
        }
    })
