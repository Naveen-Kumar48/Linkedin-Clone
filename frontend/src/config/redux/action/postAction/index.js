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

//*Api for the delete post

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

//*Actions for the increment of the likes

export const incrementLike = createAsyncThunk(
    "post/incrementLike",
    async (post, thunkAPI) => {
        try {
            const response = await clientServer.post('/increment_post_likes', {
                post_id: post.post_id,
            })

            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)

        }
    }

)

//*Action to get all the comments
export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_comments', {
                params: {
                    post_id: postData.post_id
                }
            })
            return thunkAPI.fulfillWithValue({
                comments: response.data,
            })
        } catch (error) {

        }
    }
)
//*Actions for the post Comments actions

export const postComment=createAsyncThunk(
    "post/postComment",
    async(commentData,thunkAPI)=>{
        try {
            console.log({
                post_id:commentData.post._id,
                body:commentData.body
            })
            const response=await clientServer.post('/comment',{
                token:localStorage.getItem('token'),
                post_id:commentData.post_id,
                comment_text:commentData.body
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went Wrong")
        }
    }
)