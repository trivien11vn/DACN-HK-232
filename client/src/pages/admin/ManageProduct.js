import React, {useCallback, useEffect, useState} from 'react'
import { InputForm, Pagination} from 'components'
import { useForm } from 'react-hook-form'
import { apiGetProductByAdmin, apiDeleteProduct} from 'apis/product'
import moment from 'moment'
import { useSearchParams, createSearchParams, useNavigate, useLocation} from 'react-router-dom'
import useDebounce from 'hook/useDebounce'
import UpdateProduct from './UpdateProduct'
import icons from 'ultils/icon'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { VariantProduct } from '.'


const ManageProduct = () => {
  const {MdModeEdit, MdDelete, FaCopy} = icons
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const {register,formState:{errors}, handleSubmit, watch} = useForm()
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [variant, setVariant] = useState(null)
  const [showProductName, setShowProductName] = useState(null)
  const handleDeleteProduct = async(pid) => {
    Swal.fire({
      title: 'Are you sure',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true
    }).then(async(rs)=>{
      if(rs.isConfirmed){
        const response = await apiDeleteProduct(pid)
        if(response.success){
         toast.success(response.mes)
        }
        else{
         toast.error(response.mes)
        }
        render()
      }
    })
    
  }

  const render = useCallback(() => { 
    setUpdate(!update)
   })

  const handleSearchProduct = (data) => {
  }

  const fetchProduct = async(params) => {
    const response = await apiGetProductByAdmin({...params, limit: process.env.REACT_APP_LIMIT})
    if(response.success){
      setProducts(response.products)
      setCounts(response.counts)
    }
  }

  const queryDebounce = useDebounce(watch('q'),800)
  
  useEffect(() => {
    const searchParams = Object.fromEntries([...params]) 
    fetchProduct(searchParams)
  }, [params, update])

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
  
  return (
    <div className='w-full flex flex-col gap-4 relative'>
      {editProduct &&  
      <div className='absolute inset-0 bg-zinc-900 h-fit z-50 flex-auto'>
        <UpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct}/>
      </div>}

      {variant &&  
      <div className='absolute inset-0 bg-zinc-900 h-[200%] z-50 flex-auto'>
        <VariantProduct variant={variant} render={render} setVariant={setVariant}/>
      </div>}

      <div className='h-[69px] w-full'>
      </div>
      <div className='p-4 border-b w-full flex justify-between items-center fixed top-0 bg-black'>
        <h1 className='text-3xl font-bold tracking-tight'>ManageProduct</h1>
      </div>

      <div className='flex w-full justify-end items-center px-4 '>
        <form className='w-[45%]' onSubmit={handleSubmit(handleSearchProduct)}>
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullWidth
            placeholder= 'Search product by title, description ...'
          >
            
          </InputForm>
        </form>
      </div>
      <table className='table-auto p-0'>
        <thead className='font-bold bg-blue-500 text-[13px] text-white'>
          <tr className='border border-gray-500'>
            <th className='text-center py-2'>#</th>
            <th className='text-center py-2'>Product</th>
            <th className='text-center py-2'>Category</th>
            <th className='text-center py-2'>Price</th>
            <th className='text-center py-2'>Quantity</th>
            <th className='text-center py-2'>Sold</th>
            <th className='text-center py-2'>Color</th>
            <th className='text-center py-2'>Ratings</th>
            <th className='text-center py-2'>Vatiants</th>
            <th className='text-center py-2'>Update</th>
            <th className='text-center py-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((el,idx)=>(
            <tr key={el._id} className='border border-gray-500'>
              <td className='text-center py-2'>{((+params.get('page')||1)-1)*+process.env.REACT_APP_LIMIT + idx + 1}</td>
              <td className='text-center py-2'>
                <div className='flex flex-col gap-2 font-semibold ml-5 pl-10 cursor-pointer relative' 
                    onMouseEnter={() => setShowProductName(el?._id)}
                    onMouseLeave={() => setShowProductName(null)}>
                  <img src={el.thumb} alt='thumb' className='w-14 h-14 rounded-md object-cover border-2 border-gray-600 shadow-inner'></img>
                {showProductName === el?._id && (
                  <div className='absolute bg-white border-2 border-gray-400 shadow-sm p-2 top-14 left-10 rounded-md flex gap-4 z-50'>
                    <div className='flex flex-col text-gray-700 w-[200px]'>
                      <div><strong>Name:</strong> {el?.title}</div>
                    </div>
                  </div>
                )}
                </div>
              </td>
              <td className='text-center py-2'>{el.category}</td>
              <td className='text-center py-2'>{el.price}</td>
              <td className='text-center py-2'>{el.quantity}</td>
              <td className='text-center py-2'>{el.soldQuantity}</td>
              <td className='text-center py-2'>{el.color}</td>
              <td className='text-center py-2'>{el.totalRatings}</td>
              <td className='text-center py-2'>{el.variants?.length || 0}</td>
              <td className='text-center py-2'>{moment(el.updatedAt).format('DD/MM/YYYY')}</td>
              <td className='text-center py-2'>
                <span onClick={() => setEditProduct(el)} 
                className='inline-block hover:underline cursor-pointer text-blue-500 hover:text-orange-500 px-0.5'><MdModeEdit
                size={24}/></span>
                <span onClick={() => handleDeleteProduct(el._id)} 
                className='inline-block hover:underline cursor-pointer text-blue-500 hover:text-orange-500 px-0.5'><MdDelete size={24}/></span>
                <span onClick={() => setVariant(el)} 
                className='inline-block hover:underline cursor-pointer text-blue-500 hover:text-orange-500 px-0.5'><FaCopy 
                size={22}/></span>
              </td>  
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex justify-end'>
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default ManageProduct