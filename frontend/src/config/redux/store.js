import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducer/authReducer/index.js'
/**
 * !Steps for State Management:
 * *1. Submit (Dispatch) an action from the UI.
 * *2. Handle the action in the reducer (createSlice).
 * *3. Register the reducer here.
 */

export const store = configureStore({
    reducer: {
        auth:authReducer
        
    },
});