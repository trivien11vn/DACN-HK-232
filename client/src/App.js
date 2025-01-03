import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'

import { AddPost, AdminLayout, ManageOrder, ManageBooking, ManageProduct, ManageUser, CreateProduct, DashBoard, ManageStaff, AddStaff, ManageService, AddService,StaffCalendar, ManageBookingDetail, ManagePostDetail, EditPostDetail} from 'pages/admin'
import {Login,Home,Public,OurProviders,DetailService,FAQ,Services,Products,Blogs,Final_Register,ResetPassword,DetailCart,ServiceProviderRegister, DetailProduct,ViewBlog } from 'pages/public'

import { UserLayout, History, Personal, WishList, CheckoutService, MyServiceProvider, CheckoutProduct} from 'pages/user'
import path from './ultils/path'
import {getCategories} from 'store/app/asyncAction'
import {getCategorieService} from 'store/category/asyncAction'
import {useDispatch, useSelector} from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Booking, BookingDateTIme, Cart, Modal } from './components';
import { showCart } from 'store/app/appSlice';
import ManagePost from 'pages/admin/ManagePost';

function App() {
  const dispatch = useDispatch()
  const {isShowModal, modalChildren, isShowCart} = useSelector(state => state.app)

  useEffect(() =>{
    dispatch(getCategories())
    dispatch(getCategorieService())
  },[])
  return (
    <div className="w-screen h-screen relative">
      {isShowCart && 
        <div onClick={()=>dispatch(showCart())} className='absolute inset-0 bg-overlay z-50 flex justify-end'>
        <Cart />
        </div>
      }
      {isShowModal && <Modal>{modalChildren}</Modal>}
     <Routes>
      <Route path={path.CHECKOUT_SERVICE} element={<CheckoutService />} />
      <Route path={path.CHECKOUT_PRODUCT} element={<CheckoutProduct />} />
      <Route path={path.PUBLIC} element={<Public />}>
        <Route path={path.HOME} element={<Home />} />
        <Route path={path.BLOGS} element={<Blogs />} />
        <Route path={path.DETAIL_SERVICE__CATEGORY__PID__TITLE} element={<DetailService />} />
        <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
        <Route path={path.FAQS} element={<FAQ />} />
        <Route path={path.OUR_PROVIDERS} element={<OurProviders />} />
        <Route path={path.SERVICES_CATEGORY} element={<Services />} />
        <Route path={path.PRODUCTS_CATEGORY} element={<Products />} />
        <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={path.BOOKING} element={<Booking />} />
        <Route path={path.BOOKING_DATE_TIME} element={<BookingDateTIme />} />
        <Route path={path.VIEW_POST} element={<ViewBlog />} />
        {/* <Route path={path.DETAIL_CART} element={<DetailCart />} /> */}
        {/* <Route path={path.ALL} element={<Home />} /> */}
      </Route>
      <Route path={path.ADMIN} element={<AdminLayout />}>
        <Route path={path.DASHBOARD} element={<DashBoard/>}/>
        <Route path={path.MANAGE_ORDER} element={<ManageOrder/>}/>
        <Route path={path.MANAGE_BOOKING} element={<ManageBooking/>}/>
        <Route path={path.MANAGE_BOOKING_DETAIL} element={<ManageBookingDetail/>}/>
        <Route path={path.MANAGE_PRODUCT} element={<ManageProduct/>}/>
        <Route path={path.MANAGE_USER} element={<ManageUser/>}/>
        <Route path={path.MANAGE_STAFF} element={<ManageStaff/>}/>
        <Route path={path.MANAGE_SERVICE} element={<ManageService/>}/>
        <Route path={path.CREATE_PRODUCT} element={<CreateProduct/>}/>
        <Route path={path.ADD_STAFF} element={<AddStaff/>}/>
        <Route path={path.ADD_SERVICE} element={<AddService/>}/>
        <Route path={path.STAFF_CALENDAR} element={<StaffCalendar/>}/>

        <Route path={path.ADD_POST} element={<AddPost/>}/>
        <Route path={path.MANAGE_POST} element={<ManagePost/>}/>
        <Route path={path.MANAGE_POST_DETAIL} element={<ManagePostDetail/>}/>
        <Route path={path.EDIT_POST_DETAIL} element={<EditPostDetail/>}/>
      </Route>
      <Route path={path.USER} element={<UserLayout />}>
        <Route path={path.PERSONAL} element={<Personal />}/>
        <Route path={path.MYCART} element={<DetailCart />}/>
        <Route path={path.HISTORY} element={<History/>}/>
        <Route path={path.WISHLIST} element={<WishList/>}/>
        <Route path={path.MY_SERVICE_PROVIDER} element={<MyServiceProvider/>}/>
      </Route>
      <Route path={path.FINAL_REGISTER} element={<Final_Register />} />
      <Route path={path.SERVICE_PROVIDER_REGISTER} element={<ServiceProviderRegister />} />
      <Route path={path.LOGIN} element={<Login />} />
     </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" />
      <ToastContainer />
    </div>
  );
}

export default App;