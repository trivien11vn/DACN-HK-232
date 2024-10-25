import React, { useEffect, useState } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { apiGetOrdersByAdmin } from 'apis/order';
import moment from 'moment';
import { Button, InputFormm, Pagination } from 'components';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';
import { FaTags } from "react-icons/fa";
import { AiOutlineUser, AiOutlineTeam } from 'react-icons/ai';
import path from 'ultils/path';
import withBaseComponent from 'hocs/withBaseComponent';
import { formatPrice, formatPricee } from 'ultils/helper';
import bgImage from '../../assets/clouds.svg'
import { TfiExport } from "react-icons/tfi";
import { useForm } from 'react-hook-form';
import { BsCalendar } from "react-icons/bs";
import { RxMixerVertical } from 'react-icons/rx';
import { GoPlusCircle } from "react-icons/go";

const ManageBooking = ({ dispatch, navigate }) => {
  const [params] = useSearchParams();
  const [booking, setBookings] = useState(null);
  const [counts, setCounts] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(12);

  const fetchBooking = async (params) => {
    const response = await apiGetOrdersByAdmin({ ...params, limit: process.env.REACT_APP_LIMIT });
    if (response?.success) {
      // Sắp xếp các đơn đặt chỗ theo `createdAt` từ mới nhất đến cũ nhất
      const sortedBookings = response?.order?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedBookings);
      setCounts(response?.counts);
    }
  };

  const handleOnClickDetail = (bookingid) => {
    navigate({
      pathname: `/${path.ADMIN}/${path.MANAGE_BOOKING_DETAIL}`,
      search: createSearchParams({ bookingid }).toString()
    });
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchBooking(searchParams);
  }, [params]);

  const filterBookingsByMonth = (bookings, month) => {
    if (month === 12) return bookings;
    return bookings?.filter(bookingItem => {
      const bookingMonth = moment(bookingItem?.info[0]?.date, 'DD/MM/YYYY').format('M');
      return parseInt(bookingMonth) === month + 1;
    });
  };

  const countBookingsByMonth = (bookings) => {
    if (!bookings) return 0;
    return bookings?.length;
  };

  useEffect(() => {
    setCounts(countBookingsByMonth(filterBookingsByMonth(booking, selectedMonth)));
  }, [booking, selectedMonth]);

  const {register,formState:{errors}, handleSubmit, watch} = useForm()

  console.log(booking)

  const data = [
    {
        cate: 'Hairstylist',
        color: 'rgba(255, 0, 0, 0.5)' // Màu đỏ
    },
    {
        cate: 'Barber',
        color: 'rgba(0, 255, 0, 0.5)' // Màu xanh lá cây
    },
    {
        cate: 'Nail',
        color: 'rgba(0, 0, 255, 0.5)' // Màu xanh dương
    },
    {
        cate: 'Makeup',
        color: 'rgba(255, 255, 0, 0.5)' // Màu vàng
    },
    {
        cate: 'Tattoo',
        color: 'rgba(255, 0, 255, 0.5)' // Màu tím
    },
    {
        cate: 'Massage',
        color: 'rgba(0, 255, 255, 0.5)' // Màu cyan
    },
    {
        cate: 'Gym',
        color: 'rgba(255, 128, 0, 0.5)' // Màu cam
    },
    {
        cate: 'Yoga',
        color: 'rgba(128, 0, 255, 0.5)' // Màu violet
    },
    {
        cate: 'Fitness',
        color: 'rgba(255, 128, 128, 0.5)' // Màu hồng
    }
  ];

  const getColorByCategory = (category) => {
    const item = data.find(el => el.cate === category);
    return item ? item.color : 'rgba(0, 0, 0, 0.1)'; // Màu mặc định nếu không tìm thấy
  };

  return (
    <div className="w-full h-full relative">
      <div className='inset-0 absolute z-0'>
        <img src={bgImage} className='w-full h-full object-cover'/>
      </div>
      <div className="relative z-10"> {/* Thêm lớp này để đảm bảo dòng chữ không bị che mất */}
        <div className='w-full h-20 flex justify-between p-4'>
          <span className='text-[#00143c] text-3xl font-semibold'>Manage Booking</span>
        </div>
        <div className='w-[95%] h-[600px] shadow-2xl rounded-md bg-white ml-4 mb-[200px] px-6 py-4 flex flex-col gap-4'>
          <div className='w-full h-fit flex justify-between items-center'>
            <h1 className='text-[#00143c] font-medium text-[16px]'>{`Bookings (${counts})`}</h1>
            <Button style={'px-4 py-2 rounded-md text-[#00143c] bg-[#fff] font-semibold w-fit h-fit flex gap-2 items-center border border-[#b3b9c5]'}><TfiExport className='text-lg font-bold' /> Export Data</Button>
          </div>
          <div className='w-full h-[48px] mx-[-6px] mt-[-6px] mb-[10px] flex'>
            <div className='w-[62%] h-[36px] m-[6px] flex'>
              <form className='flex-1' >
                <InputFormm
                  id='q'
                  register={register}
                  errors={errors}
                  fullWidth
                  placeholder= 'Search booking by service, customer, staff ...'
                  style={'w-full bg-[#f4f6fa] h-10 rounded-md pl-2 flex items-center'}
                  styleInput={'w-[100%] bg-[#f4f6fa] outline-none text-[#99a1b1]'}
                >
                </InputFormm>
              </form>
            </div>
            <div className='w-[25%] h-[36px] m-[6px]'>
              <Button style={'px-4 py-2 rounded-md text-[#00143c] bg-[#fff] font-normal w-full h-fit flex gap-2 items-center border border-[#b3b9c5]'}><BsCalendar className='text-lg font-semibold' /> Start date - End date</Button>
            </div>
            <div className='w-[10%] h-[36px] m-[6px]'>
              <Button style={'w-full px-4 py-2 bg-[#dee1e6] rounded-md text-[#00143c] flex gap-1 items-center justify-center font-semibold'}>
                <span className='font-bold text-xl'><RxMixerVertical /></span>
                <span>Filters</span>
              </Button>
            </div>
          </div>
          <div className='text-[#99a1b1]'>
            <div className='w-full flex gap-1 border-b border-[##dee1e6] p-[8px]'>
              <span className='w-[10%]'>Time</span>
              <span className='w-[25%]'>Service</span>
              <span className='w-[15%]'>Customer</span>
              <span className='w-[10%]'>Duration</span>
              <span className='w-[15%]'>Status</span>
              <span className='w-[20%]'>Employee</span>
              <span className='w-[5%]'>Note</span>
            </div>
            <div>
              {booking?.map((el,index) => (
                <div key={index} className='w-full flex border-b border-[#f4f6fa] gap-1 h-[56px] px-[8px] py-[12px]'>
                  <span className='w-[10%] py-2 text-[#00143c]'>{el?.info[0]?.time}</span>
                  <span className='w-[25%] py-2 text-[#00143c] text-sm flex justify-start font-medium'>
                    <div className='pl-[4px] flex items-center' style={{borderLeft: `4px solid ${getColorByCategory(el?.info[0]?.service?.category)}` }}>
                      {el?.info[0]?.service?.name}
                    </div>
                  </span>
                  <span className='w-[15%] py-2 text-[#00143c] text-sm line-clamp-1'>{`${el?.orderBy?.lastName} ${el?.orderBy?.firstName}`}</span>
                  <span className='w-[10%] px-2 py-2 text-[#00143c] text-sm line-clamp-1'>{`${el?.info[0]?.service?.duration}min`}</span>
                  <span className='w-[15%] px-2 py-2 text-[#00143c]'>Status</span>
                  <span className='w-[20%] px-4 py-2 text-[#00143c] flex items-center'>
                    <img className='w-[32px] h-[32px] rounded-full ml-[-10px] mr-[0px]' src={el?.info[0]?.staff?.avatar}/>
                  </span>
                  <span className='w-[5%] px-2 py-2 text-[#00143c] font-bold text-xl'><GoPlusCircle /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(ManageBooking);
