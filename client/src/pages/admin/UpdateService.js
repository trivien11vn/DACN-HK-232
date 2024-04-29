import { Button, InputForm, Loading, MarkdownEditor, MultiSelect, Select, SelectCategory } from 'components'
import React, { memo, useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { validate, getBase64 } from 'ultils/helper'
import {apiUpdateProduct} from 'apis/product'
import { showModal } from 'store/app/appSlice'
import { hour, minute } from 'ultils/constant'
import { apiGetAllStaffs } from 'apis'

const UpdateService = ({editService, render, setEditService}) => {
  console.log(editService)
  console.log('update service')
  const {categories_service} = useSelector(state => state.category)
  const option_category = categories_service?.map((cate) => ({
    label: cate?.title,
    value: cate?._id,
    color: cate?.color
  }));

  const [staffs, setStaffs] = useState(null)
  const fetchStaff = async(params) => {
    const response = await apiGetAllStaffs()
    if(response.success){
      setStaffs(response.staffs)
    }
  }
  useEffect(() => {
    fetchStaff()
  }, [])
  const options = staffs?.map((staff) => ({
    label: `${staff.firstName} ${staff.lastName}`,
    value: staff._id
  }));

  const dispatch = useDispatch()

  const {register, formState:{errors}, reset, handleSubmit, watch} = useForm()

  const [payload, setPayload] = useState({
    description: ''
  })

  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })

  useEffect(() => {
    reset({
      name: editService?.name || '',
      price: editService?.price || '',
      category: editService?.category || '',
      hour: Math.floor((+(editService?.duration) / 60)),
      minute: +(editService?.duration) % 60
    })
    setPayload({description: typeof editService?.description === 'object' ? editService?.description?.join(', ') : editService?.description})
    setPreview({
      thumb: editService?.thumb || '',
      images: editService?.image || []
    })
  }, [editService])
  
  const [invalidField, setInvalidField] = useState([])
  
  const changeValue = useCallback((e)=>{
    setPayload(e)
  },[payload])

  const handlePreviewThumb = async(file) => {
    const base64Thumb = await getBase64(file)
    setPreview(prev => ({...prev, thumb: base64Thumb}))
  }

  const handlePreviewImages = async(files) => {
    const imagesPreview = []
    for(let i of files){
      if(i.type !== 'image/png' && i.type !== 'image/jpeg'){
        toast.warning('The file sent is not a JPG or PNG')
        return
      }
      const base64 = await getBase64(i)
      imagesPreview.push(base64)
    }
    if(imagesPreview.length > 0){
      setPreview(prev => ({...prev, images: imagesPreview}))
    }
  }


  useEffect(() => {
    if(watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0])
  }, [watch('thumb')])

  useEffect(() => {
    if(watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'))
  }, [watch('images')])

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleSelectStaffChange = useCallback(selectedOptions => {
    setSelectedStaff(selectedOptions);
  }, []);

  const handleSelectCateChange = useCallback(selectedOptions => {
    setSelectedCategory(selectedOptions);
    console.log(selectedCategory)
  }, []);

  const handleUpdateProduct = async(data) => {
    // const invalid = validate(payload, setInvalidField)
    // if(invalid === 0){

      let finalPayload = {...data,...payload}
      if(data.thumb?.length === 0){
        console.log('check_1')
        finalPayload.thumb = preview.thumb
      }
      else{
        console.log('check_2')
        finalPayload.thumb = data.thumb[0]
      }
      console.log(finalPayload)
      if(data.images?.length === 0){
        console.log('check_3')
        finalPayload.images = preview.images
      }
      else{
        console.log('check_4')
        finalPayload.images = data.images
      }
      const formData = new FormData()

      for(let i of Object.entries(finalPayload)){
        formData.append(i[0],i[1])
      }
      formData.delete('images');
      for (let image of finalPayload.images) formData.append('images', image)

      for (var pair of formData.entries())
      {
      console.log(pair[0]+ ', '+ pair[1]); 
      }
    
      // dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
      const response = await apiUpdateProduct(formData, editService._id)
      // dispatch(showModal({isShowModal: false, modalChildren: null}))
      console.log(response)
      if(response.success){
        toast.success(response.mes)
        render()
        setEditService(null)
      }
      else{
        toast.error(response.mes)
      }
    //}
  }

  return (
    <div className='w-full'>
        <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
          <span>Update Service</span>
          <span className='text-main text-lg hover:underline cursor-pointer' onClick={()=>setEditService(null)}>Cancel</span>
        </h1>
        <div className='p-4 '>
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
            <div className='w-full my-6 flex gap-4'>
            <InputForm
              label = 'Service Name'
              register={register}
              errors={errors}
              id = 'name'
              validate = {{
                required: 'Need fill this field'
              }}
              style='flex-1'
              placeholder='Name of service ...'
            />
            <SelectCategory
              label = 'Category'
              options = {option_category}
              register={register}
              id = 'category'
              validate = {{
                required: 'Need fill this field'
              }}
              errors={errors}
              fullWidth
              onChangee={handleSelectCateChange}
              values={selectedCategory}
              style='flex-1'
            />
            </div>

            <MarkdownEditor 
              name = 'description'
              changeValue={changeValue}
              label = 'Description'
              invalidField={invalidField}
              setInvalidField={setInvalidField}
              value={payload.description}
            />
            <div className='w-full my-6 flex gap-4'>
            <div className='w-full flex flex-1 items-center gap-2'> 
              <Select 
                label = 'Hour'
                options = {hour}
                register={register}
                id = 'hour'
                validate = {{
                  required: 'Need fill this field'
                }}
                style='flex-auto'
                errors={errors}
                fullWidth
                text='Hour'
              />
              <Select 
                label = 'Minute'
                options = {minute}
                register={register}
                id = 'minute'
                validate = {{
                  required: 'Need fill this field'
                }}
                style='flex-auto'
                errors={errors}
                fullWidth
                text='Minute'
              />
            </div>
            <div className='w-full flex flex-1 items-center'> 
            <InputForm 
              label = 'Price (VNĐ)'
              register={register}
              errors={errors}
              id = 'price'
              validate = {{
                required: 'Need fill this field'
              }}
              style='flex-auto'
              placeholder='Price of new service'
              type='number'
            />
            </div>
          </div>
          <MultiSelect
            id='assigned_staff' 
            options={options}
            onChangee={handleSelectStaffChange}
            values={selectedStaff}
            />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='thumb'>Upload Thumb</label>
            <input 
              {...register('thumb', {required: 'Need upload thumb'})}
              type='file' 
              id='thumb'
            />
            {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
            </div>

            {preview.thumb 
            && 
          <div className='my-4'>
            <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'></img>
          </div>
          }

          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='images'>Upload Images Of Service</label>
            <input 
              {...register('images', {required: 'Need upload image of service'})}
              type='file' 
              id='images' 
              multiple
            />
            {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
          </div>

          {preview.images?.length > 0 
            && 
          <div className='my-4 flex w-full gap-2 flex-wrap'>
            {
              preview.images?.map((el,index) => (
                <div key={index} className='w-fit relative'>
                  <img src={el} alt='image of service' className='w-[200px] object-contain'></img>
                </div>
              ))
            }
          </div>
          }

          <div className='mt-8'>
            <Button type='submit'>
              Update service
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(UpdateService)