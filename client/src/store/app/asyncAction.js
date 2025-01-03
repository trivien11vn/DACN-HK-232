import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis'
export const getCategories = createAsyncThunk('app/categories',async(data, {rejectWithValue})=>{
    const response = await apis.apiGetCategorieService()

    if(response.success){
        return response.serviceCategories
    }
    else{
        return rejectWithValue(response)
    }
})