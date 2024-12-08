import React, {memo, useEffect} from 'react'
import clsx from 'clsx'
import { useSearchParams, useNavigate, createSearchParams, useLocation} from 'react-router-dom'

const PageItem = ({children}) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  
  const handlePagination = () => { 
    const queries = Object.fromEntries([...params]);
    if(Number(children)) queries.page = children
    // removed log
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString()
    });
    // navigate({
    //   pathname: '/login'
    // })
  }
  return (
    <button 
      className={clsx('w-10 h-10 flex justify-center', !Number(children) && 'items-end pb-2', Number(children)&&'hover:rounded-full hover:bg-gray-300 items-center', +params.get('page')===+children && 'rounded-full bg-gray-300', !+params.get('page') && +children===1 && 'rounded-full bg-gray-300')}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}>
      {children}
    </button>
  )
}

export default memo(PageItem)