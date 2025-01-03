import React, { memo } from 'react'
import clsx from 'clsx'

const Select = ({label, options=[], register, errors, id, validate, style, fullWidth, defaultValue,text}) => {
  return (
    <div className={clsx('flex flex-col gap-4', style)}>
      {label&& <label htmlFor={id}>{label}</label>}
      <select 
        className={clsx('form-select text-gray-600 max-h-[42px] cursor-pointer', 
        fullWidth && 'w-full', style)} 
        id={id} 
        {...register(id, validate)}
        defaultValue={defaultValue}
        >
        <option value=''>{text||`----CHOOSE----`}</option>
        {options?.map(el => (
          <option value={el?.code}>{el?.value}</option>
        )
        )}
      </select>
      {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select)