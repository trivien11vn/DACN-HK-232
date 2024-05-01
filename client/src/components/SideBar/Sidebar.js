import React, {useState,useEffect, memo} from "react";
import { apiGetCategories } from "../../apis/app";
import { NavLink } from "react-router-dom";
import {createSlug} from "../../ultils/helper"
import {useSelector} from 'react-redux'
const Sidebar = () => {
    const {categories} = useSelector (state => state.app)
    // console.log(category)
    return (
        <div className="flex flex-col border">
            <h3
            style={{
                backgroundColor:'red',
                color: 'white',
                padding: '10`<px 0',
                textAlign: 'center'
            }}
            >Danh Mục</h3>
            {categories?.map(el =>(
                <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    className={({isActive})=> isActive ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main' : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}>
                    {el.title}
                </NavLink>
            ) )}
        </div>
    )
}

export default memo(Sidebar)