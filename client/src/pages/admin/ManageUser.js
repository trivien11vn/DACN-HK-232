import React, { useEffect, useState, useCallback} from 'react'
import { apiUsers, apiModifyUser, apiDeleteUser} from 'apis/user'
import { roles, blockStatus } from 'ultils/constant'
import moment from 'moment'
import { InputField, Pagination, Select, Button, InputFormm } from 'components'
import useDebounce from 'hook/useDebounce'
import { createSearchParams, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import bgImage from '../../assets/clouds.svg'
import avatarUser from '../../assets/avatarDefault.png'
import { FcExport } from "react-icons/fc";
import { MdBlock } from "react-icons/md";
import { TfiExport } from 'react-icons/tfi'

const ManageUser = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {handleSubmit, register, formState:{errors}, watch } = useForm({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    phone: '',
    isBlocked: ''
  })

  const [user, setUser] = useState(null)
  const [query, setQuery] = useState({
    q: ''
  })

  const [update, setUpdate] = useState(false)
  const [editEl, setEditEl] = useState(null)
  const [params] = useSearchParams()
  const [counts, setCounts] = useState(0)
  const fetchUsers = async(params) => {
    const response = await apiUsers({...params, limit:process.env.REACT_APP_LIMIT})
    if(response.success){
      setUser(response?.users)
      setCounts(response?.counts)
    }
  }

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]) 
    console.log(searchParams)
    fetchUsers(searchParams)
  }, [params]);
  
  const render = useCallback(() => {
    setUpdate(!update)}
  ,[update])

  const queryDebounce = useDebounce(watch('q'),800)

  useEffect(() => {
    if(queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q:queryDebounce}).toString()
      })
    }
    else{
      navigate({
        pathname: location.pathname,
      })
    }
  }, [queryDebounce])

  const handleUpdate = async (data) => { 
    const response = await apiModifyUser(data, editEl._id)
    if(response.success) {
      setEditEl(null)
      render()
      toast.success(response.mes)
    }
    else{
      toast.error(response.mes)
    }
   }

  const handleDelete = (uid) => {
    Swal.fire({
      title: 'Delete this user',
      text: 'Are you ready to delete this user?',
      showCancelButton: true
    }).then(async(rs)=>{
      if(rs.isConfirmed){
        const response = await apiDeleteUser(uid)
        if(response.success) {
          render()
          toast.success(response.mes)
        }
        else{
          toast.error(response.mes)
        }
      }
    })
  }
  
   
  return (
    <div className="w-full h-full relative">
      <div className='inset-0 absolute z-0'>
        <img src={bgImage} className='w-full h-full object-cover'/>
      </div>
      <div className="relative z-10"> {/* Thêm lớp này để đảm bảo dòng chữ không bị che mất */}
        <div className='w-full h-24 flex justify-between p-4'>
          <span className='text-[#00143c] text-3xl font-semibold'>Manage Users</span>
        </div>
        <div className='w-[95%] h-[600px] shadow-2xl rounded-md bg-white ml-4 mb-[200px] px-6 py-4 flex flex-col gap-4'>
          <div className='w-full h-fit flex justify-between items-center'>
            <h1 className='text-[#00143c] font-medium text-[16px]'>{`All Customers (${counts})`}</h1>
            <div className='flex w-[50%] gap-2 items-center justify-end'>
              <Button style={'px-4 py-2 rounded-md text-[#00143c] bg-[#fff] font-semibold w-fit h-fit flex gap-2 items-center border border-[#b3b9c5]'}><TfiExport className='text-lg font-bold' /> Export Data</Button>
              <form className='flex-1' >
                <InputFormm
                  id='q'
                  register={register}
                  errors={errors}
                  fullWidth
                  placeholder= 'Search user by name, email address ...'
                  style={'w-full bg-[#f4f6fa] h-10 rounded-md pl-2 flex items-center'}
                  styleInput={'w-[100%] bg-[#f4f6fa] outline-none text-[#99a1b1]'}
                >
                </InputFormm>
              </form>
            </div>
          </div>
          <div className='text-[#99a1b1]'>
            <div className='w-full flex gap-1 border-b border-[##dee1e6] py-1 px-[8px]'>
              <span className='w-[40%] flex font-medium justify-start px-[8px]'>Customer</span>
              <span className='w-[20%] flex font-medium justify-center'>Phone</span>
              <span className='w-[10%] flex font-medium justify-center'>Status</span>
              <span className='w-[10%] flex font-medium justify-center'>Created</span>
              <span className='w-[20%] flex font-medium justify-center'>Action</span>
            </div>
            <div>
              {
                user?.map((el,index) => (
                  <div key={index} className='w-full flex border-b border-[#f4f6fa] gap-1 h-[64px] p-[8px]'>
                    <span className='w-[40%] text-[#00143c] flex items-center'>
                      <img src={el?.avatar || avatarUser} alt='avatar' className='w-[40px] h-[40px] mr-[10px]'/>
                      <div className='flex flex-col justify-center'>
                        <span className='font-semibold text-base'>{`${el?.lastName} ${el?.firstName}`}</span>
                        <span className='text-[#99a1b1] text-sm'>{el?.email}</span>
                      </div>
                    </span>
                    <span style={{fontSize:'15px', lineHeight:'1.5rem'}} className='w-[20%] text-[#00143c] flex justify-center items-center font-medium'>{el?.mobile}</span>
                    <span style={{fontSize:'15px', lineHeight:'1.5rem'}} className='w-[10%] text-[#00143c] flex justify-center items-center font-medium'>Active</span>
                    <span style={{fontSize:'15px', lineHeight:'1.5rem'}} className='w-[10%] text-[#00143c] flex justify-center items-center font-medium'>{moment(el.createdAt).format('DD/MM/YYYY')}</span>
                    <span style={{fontSize:'15px', lineHeight:'1.5rem'}} className='w-[20%] text-[#00143c] flex justify-center items-center font-medium'>
                      <div className="relative group inline-block">
                        <span className='inline-block hover:underline cursor-pointer text-[#005aee] hover:text-orange-500 px-0.5'>
                          <FcExport size={24}/>
                        </span>
                        <div className="absolute left-1/2 top-[-18px] transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#00143c] border border-[##dee1e6] text-xs p-1 rounded z-[99]">
                          Export data
                        </div>
                      </div>
                      
                      <div className="relative group inline-block">
                        <span className='inline-block hover:underline cursor-pointer text-[#0a66c2] hover:text-orange-500 px-0.5'>
                          <MdBlock size={24}/>
                        </span>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 top-[-2px] transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#00143c] border border-[##dee1e6] text-xs p-1 rounded">
                          Block
                        </div>
                      </div>
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='text-[#00143c] flex-1 flex items-end'>
            <Pagination totalCount={counts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUser