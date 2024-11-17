import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is imported
import { useDispatch, useSelector } from 'react-redux';
import { apigetLastMessages } from 'apis/message';
import defaultAvatar from 'assets/avatarDefault.png'
import {showMessageBox} from '../../store/app/appSlice'

const Message = () => {
  const navigate = useNavigate();
  const [lastMessages, setLastMessages] = useState([]);
  const {current} = useSelector(state => state.user)
  const dispatch = useDispatch()


  useEffect(() => {
    const fetchLastMessages = async () => {
      const response = await apigetLastMessages({userId: current._id})
      setLastMessages(response);
    };

    fetchLastMessages();
  }, []);

  
  const handleOpenMessageBox = (id, firstName, lastName, avatar, e) => {
    const to = {
      id, firstName, lastName, avatar
    }
    dispatch(showMessageBox({from:current?._id, to: to}))
  }

  console.log(lastMessages)
  return (
    <div className='w-[300px] h-[350px] bg-white border border-[#0a66c2] rounded-md message_box overflow-hidden shadow-lg'>
      <div className='flex justify-between items-center px-4 py-2 border-b border-[#0a66c2] h-[50px]'>
        <h3 className='font-bold text-xl text-[#0a66c2]'>Tin nhắn: </h3>
        <span className='text-gray-500 text-sm cursor-pointer' onClick={() => { navigate('/chat') }}>Xem tất cả</span>
      </div>
    
      <div className='flex h-[300px] flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-slate-400'>
        {lastMessages?.map((msg) => (
          <div key={msg._id} className='flex gap-4 justify-start border-b-2 border-gray-400 py-2 px-4' onClick={(e)=>{handleOpenMessageBox(msg?._id, msg?.firstname, msg?.lastname, msg?.avatar, e)}}>
            <img src={msg.avatar || defaultAvatar} alt={msg.firstname} className='w-10 h-10 rounded-full' />
            <div className='flex flex-col'>
              <span className='font-bold text-blue-600'>{msg.firstname} {msg.lastname}</span>
              <span className='text-gray-500'>{msg?.isFromSelf ? 'Bạn: ' : `${msg.firstname} ${msg.lastname}: `}{msg.lastMessage}</span>
            </div>
          </div>
        ))}
        {
          lastMessages?.length === 0 && 
          <div className='text-[#0a66c2] w-full h-full flex items-center justify-center text-base'>
            <span>No messages found</span>
          </div>
        }
      </div>
    </div>
  );
};

export default Message;
