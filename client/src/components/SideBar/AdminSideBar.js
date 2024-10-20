import React, { memo, Fragment, useState} from 'react'
import logo from 'assets/logo_digital_new_250x.png'
import { adminSidebar } from 'ultils/constant'
import { NavLink, Link} from 'react-router-dom'
import clsx from 'clsx'
import logoWeb from '../../assets/logoWeb.png'
import icons from 'ultils/icon'

const activeStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 bg-gray-500'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-gray-600'

const {FaCaretDown, FaCaretRight} = icons
const AdminSideBar = () => {
  const [active, setActive] = useState([])
  const handleShowTab = (tabId) =>{
    if(active.some(el=>el === tabId)){
      setActive(prev => prev.filter(el=>el !== tabId))
    }
    else{
      setActive(prev => [...prev, tabId])
    }
  }
  return (
    <div className='bg-[#00143c] z-30 min-h-full py-4 '>
        <Link ta={'/'} className='flex items-center py-2 px-4 gap-1 justify-center'>
            <img src={logoWeb} className='w-12 h-12'/>
            <span className='font-semibold text-4xl text-white mb-1'>Biz<span className='text-blue-500'>Serv</span></span>
        </Link>
        <div>
          {adminSidebar.map(el =>(
            <Fragment key={el?.id}>
              {el?.type === 'single' && 
              <NavLink 
                to={el?.path}
                className={({isActive})=> clsx(isActive && activeStyle, !isActive&& notActiveStyle)}>
                <span>{el?.icon}</span>
                <span>{el?.text}</span>
              </NavLink>}
              {el?.type === 'parent' &&
              <div onClick={() => handleShowTab(+el.id)} className='flex flex-col text-white opacity-85 '>
                <div className='px-4 py-2 flex items-center justify-between hover:bg-gray-400 cursor-pointer'> 
                  <div className='flex items-center gap-2'>
                  <span>{el?.icon}</span>
                  <span>{el?.text}</span>
                  </div>

                  {active.some(id => +id === +el.id) ? <FaCaretRight />: <FaCaretDown />}
                </div>

                {active.some(id => +id === +el.id) &&
                  <div className='flex flex-col'>
                  {el?.submenu?.map(item => (
                    <NavLink 
                      key={item?.text} 
                      to={item?.path} 
                      onClick={e=>e.stopPropagation()}
                      className={({isActive})=> clsx(isActive && activeStyle, !isActive&& notActiveStyle, 'pl-10')}>
                      {item?.text}
                    </NavLink>
                  ))}
                </div>
                }
              </div>
              }
            </Fragment>
          ))}
        </div>
    </div>
  )
}

export default memo(AdminSideBar)