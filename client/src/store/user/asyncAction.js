import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis'
export const getCurrent = createAsyncThunk('user/current',async(data, {rejectWithValue})=>{
    const response = await apis.apiGetCurrent()


    console.log("REDUX USER:", response)

    if(response.success){
        return response.res
    }
    else{
        return rejectWithValue(response)
    }
})