import React, {useEffect, useState, useCallback} from 'react'
import { useParams, useSearchParams, createSearchParams, useNavigate} from 'react-router-dom'
import { Breadcrumb, Service, SearchItemService, NewInputSelect, InputSelect, Pagination, InputField, InputFormm} from '../../components'
import { apiGetServicePublic } from '../../apis'
import { sorts } from '../../ultils/constant'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
// import withBaseComponent from 'hocs/withBaseComponent'
import { getCurrent } from 'store/user/asyncAction'
import { tinh_thanhpho } from 'tinh_thanhpho'
import { apiModifyUser } from '../../apis/user'
import Swal from "sweetalert2";
import { FaSortAmountDown, FaMoneyCheckAlt, FaCubes  } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [services, setServices] = useState(null)
  const [active, setActive] = useState(null)
  const [params] = useSearchParams()
  const [sort, setSort] = useState('')
  const [nearMeOption, setNearMeOption] = useState(false)
  const {category} = useParams()
  const {isShowModal} = useSelector(state => state.app)
  const {current} = useSelector((state) => state.user);

  const [searchFilter, setSearchFilter] = useState({
    term: '',
    province: '',
    maxDistance: ''
  })

  const fetchServiceCategories = async (queries) =>{
    if (sort) {
      queries.sort = sort;
    }
    if(category && category !== 'services'){
      queries.category = category
    }
    if (searchFilter.term) {
      queries.name = searchFilter.term
    }
    if (nearMeOption && searchFilter.province) {
      queries.province = tinh_thanhpho[searchFilter.province].name
    }
    if (nearMeOption && current?.lastGeoLocation?.coordinates?.length === 2) {
      queries.current_client_location = {
        longtitude: current.lastGeoLocation.coordinates[0],
        lattitude: current.lastGeoLocation.coordinates[1]
      }
      if (searchFilter?.maxDistance && !isNaN(parseFloat(searchFilter.maxDistance))) {
        queries.current_client_location.maxDistance = searchFilter.maxDistance;
      }
    }

    const response = await apiGetServicePublic(queries)
    console.log(response)
    if(response.success) setServices(response)
    dispatch(getCurrent())
  }

  useEffect(() => {
    window.scrollTo(0,0)
    const queries = Object.fromEntries([...params])
    let priceQuery =  {}
    if(queries.to && queries.from){
      priceQuery = {$and: [
        {price: {gte: queries.from}},
        {price: {lte: queries.to}},
      ]}
      delete queries.price
    }
    else{
      if(queries.from) queries.price = {gte:queries.from}
      if(queries.to) queries.price = {gte:queries.to}
    }
    delete queries.from
    delete queries.to
    const q = {...priceQuery, ...queries}
    fetchServiceCategories(q)
  }, [params, searchFilter, nearMeOption])
  
  const changeActive = useCallback((name)=>{
    if(name===active) setActive(null)
    else {
      setActive(name)
    }
  },[active])

  // const changeValue = useCallback((value)=>{
  //   setSort(value)
  // },[sort])

  useEffect(() => {
    if(sort){
      navigate({
        pathname: `/service/${category}`,
        search: createSearchParams({
          sort
        }).toString()
      }) 
    }   
  }, [sort])

  useEffect(() => {
  }, [searchFilter])

    const handleGetDirections = () => {
    Swal.fire({
      title: 'Chia sẻ vị trí',
      text: "Bạn có muốn chia sẻ vị trí hiện tại của mình để xem đường đi?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Chia sẻ',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await apiModifyUser({ lastGeoLocation: {
              type: "Point",
              coordinates: [longitude, latitude]
            } }, current._id);
            // Call the function to show the route using latitude and longitude
            // showRoute(latitude, longitude);
            setNearMeOption(prev => !prev);
          }, () => {
            Swal.fire('Không thể lấy vị trí của bạn.');
          });
        } else {
          Swal.fire('Geolocation không khả dụng.');
        }
      }
    });
  };

  return (
    <div className='w-full'>
      <div className='h-[81px] flex items-center justify-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className='w-main p-2 flex justify-start m-auto mt-8'>
        <div className='flex-auto flex flex-col gap-3'>
          {/* <span className='font-semibold text-sm'>Filter by:</span> */}
          <div className='flex items-center gap-4'>
            {/* <FaMoneyCheckAlt />
            <SearchItemService name='price' activeClick={active} changeActiveFilter={changeActive} type='input'/>
            <FaCubes />
            <SearchItemService name='category' activeClick={active} changeActiveFilter={changeActive}/>
            <FaSortAmountDown />
            <NewInputSelect value={sort} options={sorts} changeValue={changeValue} /> */}

            <div className="grow flex flex-col">
              <label className="text-gray-800 font-medium">Search&nbsp;By:&nbsp;</label>
              <InputFormm
                id='q'
                register={()=>{}}
                errors={()=>{}}
                fullWidth
                placeholder= 'Search blog by title name, tag ...'
                style={'w-full bg-[#f4f6fa] min-h-10 rounded-md pl-2 flex items-center'}
                styleInput={'w-[100%] bg-[#f4f6fa] outline-none text-[#99a1b1]'}
                onChange={(event) => {}}
              >
              </InputFormm>
            </div>

          <span className='flex gap-1'>
            <span className='font-semibold text-sm p-5'>Near Me Search:</span>
            <input className='ml-3 p-5' onInput={() => {handleGetDirections()}} type="checkbox"/>
          </span>

          { nearMeOption && 
            <>
              <span className='font-semibold text-sm p-3'>Province:</span>
              <InputSelect
                value={searchFilter?.province}
                options={Object.entries(tinh_thanhpho).map(ele => { return {id:ele[0], text:ele[1]?.name, value:ele[0]}})}
                changeValue={(value) => {setSearchFilter(function(prev) {return {...prev, province: value};}) }}
              />
            </>
          }
          { nearMeOption && <InputField nameKey='maxDistance' value={searchFilter.maxDistance} setValue={setSearchFilter} placeholder={"Maximum Distance(optional)"} /> }
          {/* </div> */}

            <div className='flex flex-col'>
              {/* <FaSortAmountDown />
              <NewInputSelect value={selectedSort} options={sortOptions} changeValue={(value) => {setSelectedSort(value);}} /> */}
              <label className="text-gray-800 font-medium">Order&nbsp;By:&nbsp;</label>
              <select value={""}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option value="-likes">No Order</option>
                  <option value="-likes">Liked Most</option>
                  <option value="-numberView">Most Viewed</option>
                  <option value="-createdAt">Created date</option>
              </select>
            </div>
            <div className='flex flex-col'>
              {/* <FaSortAmountDown />
              <NewInputSelect value={selectedSort} options={sortOptions} changeValue={(value) => {setSelectedSort(value);}} /> */}
              <label className="text-gray-800 font-medium">Order&nbsp;By:&nbsp;</label>
              <select value={""}
                onChange={(e) => {}}
                className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option value="-likes">No Order</option>
                  <option value="-likes">Liked Most</option>
                  <option value="-numberView">Most Viewed</option>
                  <option value="-createdAt">Created date</option>
              </select>

              <Button
              handleOnclick={() => { fetchCurrentBlogList();}}
            >
              <span className="flex justify-center gap-2 items-center">
                <FaSearch /><span>Search</span>
              </span>
            </Button>

            <Button
              handleOnclick={() => { }}
              style="px-4 py-2 rounded-md text-white bg-slate-400 font-semibold my-2"
            >
              <span className="flex justify-center gap-2 items-center">
                <FaBahai /><span>Reset</span>
              </span>
            </Button>
            </div>

            <div className='flex justify-start m-auto'>
                {/* <span className='font-semibold text-sm p-5'>Search By:</span> */}
                {/* <div className='w-full'> */}
                {/* <InputField nameKey='term' value={searchFilter.term} setValue={setSearchFilter} placeholder={"Search By Name, Province..."} />
                <span className='font-semibold text-sm p-5'>Near Me Search:</span>
                <input className='ml-3 p-5' onInput={() => {handleGetDirections()}} type="checkbox"/>
                { nearMeOption && 
                  <>
                    <span className='font-semibold text-sm p-3'>Province:</span>
                    <InputSelect
                      value={searchFilter?.province}
                      options={Object.entries(tinh_thanhpho).map(ele => { return {id:ele[0], text:ele[1]?.name, value:ele[0]}})}
                      changeValue={(value) => {console.log(value); setSearchFilter(function(prev) {return {...prev, province: value};}) }}
                    />
                  </>
                }
                { nearMeOption && <InputField nameKey='maxDistance' value={searchFilter.maxDistance} setValue={setSearchFilter} placeholder={"Maximum Distance(optional)"} /> } */}
                {/* </div> */}
            </div>
          </div>
        </div>
        {/* <div className='flex flex-col gap-3'>
          <div className='w-full'>

          </div>
        </div> */}
      </div>
      <div className='w-main border p-4 flex justify-start m-auto mt-8'>
          <span className='font-semibold text-sm p-5'>Search By:</span>
          {/* <div className='w-full'> */}
          {/* <InputField nameKey='term' value={searchFilter.term} setValue={setSearchFilter} placeholder={"Search By Name, Province..."} /> */}

        </div>
      <div className={clsx('mt-8 w-main m-auto flex gap-4 flex-wrap', isShowModal ? 'hidden' : '')}>
        {services?.services?.map((service, index) => (
          <div key={index} className='w-[32%]'>
            <Service serviceData={service}/>
          </div>
        ))}
      </div>
      <div className='w-main m-auto my-4 flex justify-end'>
       {services&&
       <Pagination 
       totalCount={services?.counts}/>}
      </div>
      <div className='w-full h-[200px]'>
      </div>
    </div>

  )
}

export default Services