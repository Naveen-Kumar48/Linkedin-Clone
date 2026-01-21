import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk("user/login", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post(`/login`, {
            email: user.email,
            password: user.password
        })
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        } else {
            return thunkAPI.rejectWithValue({ message: "Invalid token not provided" });
        }
        return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})



//register action 

export const registerUser = createAsyncThunk("user/register", async (user, thunkAPI) => {
    try {
        const request = await clientServer.post("/register", {

            username: user.username,
            password: user.password,
            email: user.email,
            name: user.name
        })
        return request.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})



//*  Get about the user

export const getAboutUser = createAsyncThunk("user/getAboutUser", async (user, thunkAPI) => {
    try {
        // console.log(user.token)
        const response = await clientServer.get("/getuser_profile", { params: { token: user.token } });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

//*Get all users

export const getAllUsers = createAsyncThunk("user/getAllUsers", async (_, thunkAPI) => {
    try {
        const response = await clientServer.get("user/get_allusers");
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})


//* action for the send connection request 

export const sendConnectionRequest = createAsyncThunk("user/sendConnectionRequest", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post("/user/send_connection_request", {
            token: user.token,
            connectionId: user.connectionId
        })
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

//*action fro the get connection request
export const getConnectionsRequest = createAsyncThunk("user/getConnectionsRequest", async (user, thunkAPI) => {
    try {
        const response = await clientServer.get("/user/getConnectionRequest", {
            params: { token: user.token }
        })
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

//action for the get my connection request

export const getMyConnectionRequests = createAsyncThunk("/user/getConnectionRequest", async (user, thunkAPI) => {
    try {
        const response = await clientServer.get("/user/user_connection_request", {
            params: { token: user.token }
        })
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

//*action for the accept connection request

export const acceptConnectionRequest = createAsyncThunk("user/acceptConnectionRequest", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post("/user/accept_connection_request", {
            token: user.token,
            connectionId: user.connectionId,
            action: user.action
        })
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})