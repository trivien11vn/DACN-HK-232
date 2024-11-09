import React, { memo } from 'react'
import clsx from 'clsx'
const InputField = ({value, setValue, nameKey, type, invalidField, setInvalidField, style, fullWidth, placeholder, isHideLabel, onKeyPress, onChange}) => {
    return (
    <div className={clsx('relative flex flex-col mb-2 text-gray-600', fullWidth && 'w-full')}>
        {!isHideLabel&& value?.trim() !== '' &&<label className='text-[10px] animate-slide-top-sm absolute top-[2px] left-[8px] block bg-white px-2' htmlFor={nameKey}>{nameKey?.slice(0,1)?.toUpperCase() + nameKey?.slice(1)}</label>}
        <input type={type||'text'} 
        className= {clsx('px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none', style)} 
        placeholder={placeholder || nameKey?.slice(0,1)?.toUpperCase() + nameKey?.slice(1)}
        value = {value}
        onChange={e => {
            setValue(prev => ({...prev, [nameKey]: e.target.value}));
            if (onChange) onChange(e);
        }}
        onFocus={()=> setInvalidField && setInvalidField([])}
        onKeyDown={onKeyPress}
        />
        {invalidField?.some(el => el.name === nameKey) && <small className='text-[#0a66c2] font-[10px] italic'>
          {invalidField?.find(el => el.name === nameKey)?.mes}
        </small>}
    </div>
  )
}

export default memo(InputField)