import React, { memo, useRef, useEffect, useState} from 'react'
import logo_digital_new_250x from 'assets/logo_digital_new_250x.png'
import { voteOptions } from 'ultils/constant'
import icons from 'ultils/icon'
import {Button} from 'components'

const {FaStar} = icons
const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
  const modalRef = useRef()
  const [chooseStar, setChooseStar] = useState(null)

  const [comment, setComment] = useState('')
  useEffect(() => {
    modalRef.current.scrollIntoView({block:'center', behavior:'smooth'})
  },[])
  return (
    <div onClick={e=> e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] p-6 flex flex-col gap-4 items-center justify-center rounded-md border border-gray-500 shadow-md animate-scale-up-center'>
      <h1 className='text-center font-semibold text-main text-3xl'>{`Rating ${nameProduct}`}</h1>
      <textarea 
      onChange={e=>setComment(e.target.value)}
      value = {comment}
      className='form-textarea w-full placeholder:italic placeholder:text-sm placeholder:text-gray-500'
      placeholder='Type something ...'
      ></textarea>
      <div className='w-full flex flex-col gap-4'>
        <p className='text-center'>How do you like about this service?</p>
        <div className='flex items-center justify-center gap-4'>  
          {voteOptions.map(el=>(
            <div 
              onClick={()=>setChooseStar(el.id)}
              className='bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-4 w-[80px] h-[80px] flex flex-col items-center justify-center gap-2' key={el.id}>
              {(Number(chooseStar) && el.id<=chooseStar)? <FaStar color='orange'/>: <FaStar color='gray'/>}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button fullWidth handleOnclick={()=>handleSubmitVoteOption({comment, score: chooseStar})}>Submit</Button>
    </div>
  )
}

export default memo(VoteOption)