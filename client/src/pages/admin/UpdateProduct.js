import { Button, InputForm, InputFormm, Loading, MarkdownEditor, Select, SelectCategory } from 'components'
import React, { memo, useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { validate, getBase64 } from 'ultils/helper'
import {apiGetOneProduct, apiUpdateProduct} from 'apis/product'
import { showModal } from 'store/app/appSlice'
import bgImage from '../../assets/clouds.svg'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'
import { MdAdd, MdDelete } from 'react-icons/md'
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'
import path from 'ultils/path'

const UpdateProduct = () => {
  const {product_id} = useParams()
  const {categories_service} = useSelector(state => state.category)
  const dispatch = useDispatch()
  const [editProduct, setEditProduct] = useState(null)
  const {register, formState:{errors}, reset, handleSubmit, watch} = useForm()
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [colorCode, setColorCode] = useState(null)
  const [specifications, setSpecifications] = useState([])
  const [errorSpecification, setErrorSpecification] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  console.log(editProduct)
  const [payload, setPayload] = useState({
    description: ''
  })
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })
  const option_category = categories_service?.map((cate) => ({
    label: cate?.title,
    value: cate?._id,
    color: cate?.color
  }));

  const validateSpecification = () => {
    const newErrors = {};
    specifications.forEach((spec, index) => {
      if (!spec.key.trim() || !spec.value.trim()) {
        newErrors[`spec${index}`] = "Both key and value are required";
      }
    });

    setErrorSpecification(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecification = (index) => {
    const updatedSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecs);
  };

  const handleSelectCateChange = useCallback(selectedOptions => {
    setSelectedCategory(selectedOptions);
  }, []);

  const handleChangeColor = (e) => {
    setColorCode(e.target.value);
  }

  useEffect(() => {
    const fetchEditProductData = async() => {
      const response = await apiGetOneProduct(product_id)
      if(response?.success){
        setEditProduct(response?.product)
      }
    }
    fetchEditProductData()
  }, [product_id])

  useEffect(() => {
    reset({
      title: editProduct?.title || '',
      price: editProduct?.price || '',
      quantity: editProduct?.quantity || '',
      color: editProduct?.color || '',
      category: editProduct?.category || '',
    })
    setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description})
    setPreview({
      thumb: editProduct?.thumb || '',
      images: editProduct?.image || []
    })
    setSelectedCategory(editProduct?.category)
    setColorCode(editProduct?.colorCode || '#000000')
    setSpecifications(editProduct?.specifications || []);
  }, [editProduct])
  
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

  const handleUpdateProduct = async(data) => {
    const invalid = validate(payload, setInvalidField)
    if(invalid === 0 && validateSpecification()){
      let finalPayload = {...data,...payload, colorCode}
      if(selectedCategory){
        finalPayload.category = selectedCategory
      }

      if(data.thumb?.length === 0){
        finalPayload.thumb = preview.thumb
      }
      else{
        finalPayload.thumb = data.thumb[0]
      }

      if(data.images?.length === 0){
        finalPayload.images = preview.images
      }
      else{
        finalPayload.images = data.images
      }

      if (specifications?.length > 0) {
        finalPayload.specifications = specifications
      }
      const formData = new FormData()

      for (let [key, value] of Object.entries(finalPayload)) {
        // Nếu là mảng specifications, duyệt qua từng mục và thêm vào formData
        if (key === 'specifications' && Array.isArray(value)) {
          value.forEach((spec, index) => {
            formData.append(`specifications[${index}][key]`, spec.key)
            formData.append(`specifications[${index}][value]`, spec.value)
          })
        } else {
          formData.append(key, value)
        }
      }

      formData.delete('images');
      for (let image of finalPayload.images) formData.append('images', image)
    
      setIsLoading(true);
      const response = await apiUpdateProduct(formData, editProduct._id)
      setIsLoading(false)

      if(response.success){
        toast.success(response.mes)
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }
      else{
        toast.error(response.mes)
      }
    }
  }

  const handleBackManageProduct = () => {
    window.history.back()
  }

  const handleNavigateUpdateVariant = (varianId) => {
    navigate(`/${path.ADMIN}/update_variant_product/${editProduct?._id}/${varianId}`)
  }
  return (
    <div className='w-full h-full relative'>
      <div className='inset-0 absolute z-0'>
        <img src={bgImage} className='w-full h-full object-cover'/>
      </div>
      <div className='relative z-10 w-full'>
        <div className='w-full h-fit flex items-end p-4'>
          <div onClick={handleBackManageProduct} className='text-[#00143c] cursor-pointer'><FaArrowLeft size={28}/></div>
          <span className='text-[#00143c] text-3xl h-fit font-semibold'>Update Product</span>
        </div>
        <div className='w-[95%] h-fit shadow-2xl rounded-md bg-white ml-4 mb-[50px] px-4 py-2 flex flex-col gap-4'>
          <form onSubmit={handleSubmit(handleUpdateProduct)}>
            <div className='w-full my-6 flex gap-4'>
              <InputFormm
                label = 'Product Name'
                register={register}
                errors={errors}
                id = 'title'
                validate = {{
                  required: 'Need fill this field'
                }}
                placeholder='Name of product ...'
                style='flex-1 flex flex-col'
                styleLabel={'text-[#00143c] font-medium mb-1'}
                styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
              />
              <SelectCategory
                label = 'Category'
                styleLabel={'text-[#00143c] font-medium mb-1'}
                style = 'flex-1 flex flex-col z-[999]'
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
              />
            </div>
            <div className='w-full my-6 flex gap-4'>
              <InputFormm
                label = 'Price'
                register={register}
                errors={errors}
                id = 'price'
                validate = {{
                  required: 'Need fill this field'
                }}
                placeholder='Price of new product'
                type='number'
                style='flex-1 flex flex-col'
                styleLabel={'text-[#00143c] font-medium mb-1'}
                styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
              />
              <InputFormm
                label = 'Quantity'
                register={register}
                errors={errors}
                id = 'quantity'
                validate = {{
                  required: 'Need fill this field'
                }}
                placeholder='Quantity of new product'
                type='number'
                style='flex-1 flex flex-col'
                styleLabel={'text-[#00143c] font-medium mb-1'}
                styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
              />
            </div>

            <div className='w-full my-6 flex gap-4'>
              <InputFormm
                label = 'Color'
                register={register}
                errors={errors}
                id = 'color'
                validate = {{
                  required: 'Need fill this field'
                }}
                placeholder='Color of new product'
                style='flex-1 flex flex-col'
                styleLabel={'text-[#00143c] font-medium mb-1'}
                styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
              />
              <div className='flex-1 flex items-end'>
                    <div className="mt-1 flex w-full items-center space-x-4">
                        <input
                            type="color"
                            id="colorCode"
                            name="colorCode"
                            value={colorCode}
                            onChange={handleChangeColor}
                            className="h-10 flex-1 rounded cursor-pointer"
                            aria-label="Product Color"
                        />
                        <div
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
                            style={{ backgroundColor: colorCode }}
                        >
                            <IoColorPaletteOutline className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-[#00143c] font-medium">Technical Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0a66c2] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <MdAdd className="mr-2" /> Add Specification
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="relative p-4 border rounded-lg bg-gray-50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`spec-key-${index}`}
                          className="block text-sm font-medium text-[#00143c]"
                        >
                          Specification Key
                        </label>
                        <input
                          type="text"
                          id={`spec-key-${index}`}
                          value={spec.key}
                          onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-[#00143c] outline-none"
                          placeholder="e.g., CPU, RAM"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`spec-value-${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Specification Value
                        </label>
                        <input
                          type="text"
                          id={`spec-value-${index}`}
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-[#00143c] outline-none"
                          placeholder="e.g., Intel i7, 16GB"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label="Remove specification"
                    >
                      <MdDelete size={20} />
                    </button>

                    {errorSpecification[`spec${index}`] && (
                      <p className="mt-1 text-sm text-red-600">{errorSpecification[`spec${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full flex flex-col gap-1 my-6'>
              <span className='text-[#00143c] font-medium'>Description</span>
              <MarkdownEditor 
                name = 'description'
                changeValue={changeValue}
                invalidField={invalidField}
                setInvalidField={setInvalidField}
                className='outline-none'
                value={payload.description}
              />
            </div>

            <div className='w-full my-6 flex flex-col'>
              <label className='text-[#00143c] font-medium mb-1' htmlFor='thumb'>Upload Thumb</label>
              <input 
                {...register('thumb')}
                type='file' 
                accept="image/*"
                id='thumb'
                className='text-[#00143c]'
              />
              {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
    
              {preview.thumb 
                && 
              <div className='mt-2 flex justify-start'>
                <img src={preview.thumb} alt='thumbnail' className='w-[264px] max-h-[200px] object-contain border border-[#dee1e6] rounded-md shadow-inner'></img>
              </div>
              }
            </div>
            <div className='w-full my-6 flex flex-col'>
              <label className='text-[#00143c] font-medium mb-1' htmlFor='thumb'>Upload Images Of Product</label>
              <input 
                {...register('images')}
                type='file' 
                accept="image/*"
                id='images' 
                multiple
                className='text-[#00143c]'
              />
              {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
            
              {preview.images?.length > 0 
                && 
              <div className='mt-2 flex w-[800px] gap-1 overflow-x-auto px-2 py-1 scrollbar-thin'>
                {
                  preview.images?.map((el,index) => (
                    <img key={index} src={el} alt='image of product' className='w-[33%] max-h-[200px] object-contain border border-[#dee1e6] rounded-md shadow-inner'></img>
                  ))
                }
              </div>
              }
            </div>
            {
              editProduct?.variants?.length > 0 &&
              <div className='w-full flex flex-col gap-2'>
                <span className='text-[#00143c] text-lg font-medium'>Edit variants:</span>
                <div className='w-full flex gap-2'>
                  {
                    editProduct?.variants?.map((el, index) => (
                      <div onClick={()=>{handleNavigateUpdateVariant(el?._id)}} key={index} className='w-[30%] p-2 rounded-md border flex gap-2 shadow-md cursor-pointer bg-gray-100 hover:bg-gray-200'>
                        <img src={el?.thumb} className='w-[100px] h-[100px] object-contain'></img>
                        <div className='p-2 flex flex-col justify-center'>
                          <span className='text-[#00143c] text-sm font-medium'>{el?.title}</span>
                          <span className='text-[#00143c] text-sm font-medium'>{`Color: ${el?.color}`}</span>
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white"
                            style={{ backgroundColor: el?.colorCode || '#111111' }}
                          ></div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            }
            <div className='w-full mt-6 mb-4 flex justify-center'>
              <button disabled={isLoading} type='submit' className={'px-4 py-2 rounded-md text-white bg-[#005aee] font-semibold w-fit h-fit flex gap-1 items-center disabled:opacity-50 disabled:cursor-not-allowed'}>
                  {isLoading ? (
                      <span className="flex items-center">
                      <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Updating product...
                      </span>
                  ) : (
                      <span className='flex items-center'>
                      Update product
                      </span>
                  )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default memo(UpdateProduct)