import React, {useState, useEffect, memo} from 'react'
import {apiGetProduct} from 'apis/product'
import {Service, CustomSliderService} from '..'
import {getNewProducts} from 'store/product/asyncAction'
import { useDispatch, useSelector} from 'react-redux'
import clsx from 'clsx'
import { apiGetServicePublic } from 'apis/service'
const tabs = [
    {
        id: 1,
        name: 'best seller'
    },
    {
        id: 2,
        name: 'new arrivals'
    },
]

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null)
    const [activeTab, setActiveTab] = useState(1)
    const [product, setProduct] = useState(null)
    const dispatch = useDispatch()
    const {newProducts} = useSelector(state => state.product)
    const {isShowModal} = useSelector(state => state.app)
    const fetchProduct =  async() =>{
        const response = await apiGetServicePublic()
        // {sort:'-sold'}
        if(response?.success){
            setBestSeller(response.services)
            setProduct(response.services)}
        
    }
    useEffect(()=>{
        fetchProduct()
        dispatch(getNewProducts())
    },[])

    useEffect(()=>{
        if(activeTab===1) setProduct(bestSeller)
        else if(activeTab===2) setProduct(newProducts)
    },[activeTab])
  return (
    <div className={clsx(isShowModal ? 'hidden' : '' )} style={{marginBottom:'20px'}}>
        <div className='flex text-[15px] ml-[-32px]'>
            {tabs.map(el => (
                <span 
                    key={el.id} 
                    className={`font-semibold uppercase px-8 border-r text-gray-400 cursor-pointer ${activeTab === el.id ? 'text-gray-900': ''}`}
                    onClick={()=> setActiveTab(el.id)}>
                    {el.name}
                </span>
            ))}
        </div>
        <div className='mt-4 mx-[-10px] border-t-2 border-main pt-4'>
            <CustomSliderService products={product} activeTab={activeTab} normal={false}/>
        </div>
        <div className='w-full flex gap-4 mt-4'>
            <img src="https://www.benchcraftcompany.com/images/CG5_size.jpg"
                className='flex-1 h-[220px] w-[160px] object-cover'
            />
            <img src="https://www.benchcraftcompany.com/images/CG1_size.jpg"
                className='flex-1 h-[220px] w-[160px] object-cover'
            />
        </div>
    </div>

  )
}

export default memo(BestSeller)