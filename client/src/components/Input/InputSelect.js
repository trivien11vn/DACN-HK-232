import React, { memo } from 'react'

const InputSelect = ({value, changeValue, options, className}) => {
  return (
    <select value={value}
      onChange={e=> changeValue(e.target.value)}
      className={className ? `${className} form-select` : 'form-select'}
    >
        <option value="">No Option</option>
        {options?.map(el=> (
            <option key={el.id} value={el.value}>{el.text}</option>
        ))}
    </select>
  )
}

export default memo(InputSelect)