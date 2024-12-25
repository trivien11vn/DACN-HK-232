import React, {useEffect, useState, useCallback} from 'react'
import { useParams, useSearchParams, createSearchParams, useNavigate } from 'react-router-dom'
import { apiSearchServiceAdvanced, apiSearchServicePublic, apiGetServicePublic, apiGetCategorieService } from '../../apis'
// import { Breadcrumb, Service, SearchItemService, InputSelect, Pagination, InputField} from '../../components'
// import Masonry from 'react-masonry-css'
// import { useParams, useSearchParams, createSearchParams, useNavigate} from 'react-router-dom'
import { Breadcrumb, Service, SearchItemService, NewInputSelect, InputSelect, Pagination, InputField, InputFormm} from '../../components'
// import { apiGetServicePublic,  } from '../../apis'
// import { sorts } from '../../ultils/constant'
import Select from 'react-select';
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
// import withBaseComponent from 'hocs/withBaseComponent'
import { getCurrent } from 'store/user/asyncAction'
import { tinh_thanhpho } from 'tinh_thanhpho';
import { apiModifyUser } from '../../apis/user';
import Swal from "sweetalert2";
import Button from 'components/Buttons/Button';
import { FaBahai, FaSearch  } from "react-icons/fa";
import { HashLoader } from 'react-spinners';
import ToggleButton from './ToggleButton';

const REACT_APP_PAGINATION_LIMIT_DEFAULT = process.env.REACT_APP_LIMIT;
const Services = () => {
  // const navigate = useNavigate()
  const dispatch = useDispatch()
  const [services, setServices] = useState(null)
  // const [active, setActive] = useState(null)
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('')
  const [nearMeOption, setNearMeOption] = useState(false);
  const {category} = useParams()
  const {isShowModal} = useSelector(state => state.app);
  const [filterCateg, setFilterCateg] = useState([]);
  const {current} = useSelector((state) => state.user);
  const [svCategories, setSvCategories] = useState([]);

  const [searchedClick, setSearchedClick] = useState(false);
  const [resetClicked, setResetClicked] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    term: '',
    province: '',
    maxDistance: '',
    unit: 'km'
  });
  const [clientLat, setClientLat] = useState(999999);
  const [clientLon, setClientLon] = useState(999999);
  const [totalServiceCount, setTotalServiceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  // const prevSearchTermRef = useRef(searchFilter.term);
  const isClientLatLongValid = (clientLat, clientLon) => {
    return clientLat >= -90 && clientLon >= -90 && clientLat <= 180 && clientLon <= 180;
  }
  const isClientDistanceValid = (distanceText, unit) => {
    return /^-?\d+$/.test(distanceText) && (unit === 'km' || unit === 'm');
  }

  const fetchServicesAdvanced = async (queries, advancedQuery) => {
    setIsLoading(true);
    let response = [];
    // const currerntParamPage = params.get('page');
    // const offset = currerntParamPage > 0 ? currerntParamPage - 1 : 0;

    // if (useAdvanced) {
      const categoriesChosen = filterCateg.map(cat => cat.value);
      // if(categoriesChosen){
      advancedQuery.categories = categoriesChosen;
      // }
  // const fetchServicesAdvanced = async (queries) =>{
  //   if (sort) {
  //     queries.sort = sort;
  //   }
  //   if(category && category !== 'services'){
  //     queries.categories = filterCateg;
  //   }
    // if (searchFilter.term) {
    //   queries.name = searchFilter.term
    // }
    if (nearMeOption && searchFilter.province) {
      advancedQuery.province = tinh_thanhpho[searchFilter.province].name;
    }

    response = await apiSearchServiceAdvanced(advancedQuery);
    
    if(response.success) setServices(response?.services?.hits || []);
    
    setTotalServiceCount(response?.services?.total?.value)

    // response = await apiGetServicePublic(queries)
    // if(response.success) setServices(response)
    dispatch(getCurrent())
  // }
    setIsLoading(false);
}

  useEffect(() => {
    (async () => {
      let resp = await apiGetCategorieService();

      if (resp.success && resp.serviceCategories?.length) {
        setSvCategories(resp.serviceCategories.map(cat => {
          return {
            value: cat.title,
            label: cat.title
          }
        }));
      }
    })();
  }, [searchFilter]);


  useEffect(() => {
    window.scrollTo(0,0);
    const queries = Object.fromEntries([...params])

    const q = {
      ...queries}

    let advancedQuery = {
      searchTerm: searchFilter.term,
      limit: REACT_APP_PAGINATION_LIMIT_DEFAULT,
      offset: 0,
      sortBy: sort?.value || '',
      // clientLat: 45, clientLon: 45,
      // distanceText: "2000km",
    };

    if (nearMeOption && isClientLatLongValid(clientLat, clientLon)) {
      advancedQuery = {
        ...advancedQuery,
        clientLat,
        clientLon
      }
      advancedQuery.sortBy += ' location';

      if (isClientDistanceValid(searchFilter.maxDistance, searchFilter.unit)) {
        advancedQuery = {
          ...advancedQuery,
          distanceText: searchFilter.maxDistance + searchFilter.unit
        }
      }
    }

    queries.page = 1;
    setParams(queries);

    fetchServicesAdvanced(q, advancedQuery);
  }, [searchedClick, resetClicked, nearMeOption]);


//   // for page changing
  useEffect(() => {
    window.scrollTo(0,0)
    const queries = Object.fromEntries([...params]);

    // let priceQuery =  {}
    // if(queries.to && queries.from){
    //   priceQuery = {$and: [
    //     {price: {gte: queries.from}},
    //     {price: {lte: queries.to}},
    //   ]}
    //   delete queries.price
    // }
    // else{
    //   if(queries.from) queries.price = {gte:queries.from}
    //   if(queries.to) queries.price = {gte:queries.to}
    // }
    // delete queries.from
    // delete queries.to
    const q = {...queries}

    let advancedQuery = {
      searchTerm: searchFilter.term,
      limit: REACT_APP_PAGINATION_LIMIT_DEFAULT , offset: parseInt(params.get('page')) ? params.get('page')-1 : 0,
      sortBy: sort?.value || ''
    };


    if (nearMeOption && isClientLatLongValid(clientLat, clientLon)) {
      advancedQuery = {
        ...advancedQuery,
        clientLat,
        clientLon
      }
      advancedQuery.sortBy += ' location';

      if (isClientDistanceValid(searchFilter.maxDistance, searchFilter.unit)) {
        advancedQuery = {
          ...advancedQuery,
          distanceText: searchFilter.maxDistance + searchFilter.unit
        }
      }
    }

    fetchServicesAdvanced(q, advancedQuery);
  }, [params]);
  
  // const changeActive = useCallback((name)=>{
  //   if(name===active) setActive(null)
  //   else {
  //     setActive(name)
  //   }
  // },[active])

  // const changeValue = useCallback((value)=>{
  //   setSort(value)
  // },[sort])

  // useEffect(() => {
  //   if(sort){
  //     navigate({
  //       pathname: `/service/${category}`,
  //       search: createSearchParams({
  //         sort
  //       }).toString()
  //     })
  //   }   
  // }, [sort]);

  // useEffect(() => {
  // }, [searchFilter])

  const handleGetDirections = () => {
    if (nearMeOption) {
      setNearMeOption(false);
      setSearchFilter({
        ...searchFilter,
        province: '',
        maxDistance: ''
      })
      return;
    }
    if (clientLat !== 999999 && clientLon !== 999999) {
      setNearMeOption(true);
      return;
    }
    // Swal.fire({
    //   title: 'Chia sẻ vị trí',
    //   text: "Bạn có muốn chia sẻ vị trí hiện tại của mình để xem đường đi?",
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Chia sẻ',
    //   cancelButtonText: 'Không'
    // }).then((result) => {
    //   if (result.isConfirmed) {
        if ("geolocation" in navigator) {

            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(async (position) => {

              const { latitude, longitude } = position.coords;

              // await apiModifyUser({ lastGeoLocation: {
              //   type: "Point",
              //   coordinates: [longitude, latitude]
              // } }, current._id);
              // Call the function to show the route using latitude and longitude
              //  showRoute(latitude, longitude);
              setClientLat(latitude);
              setClientLon(longitude);

              setNearMeOption(true);

              setIsLoading(false);
          }, () => {
            setIsLoading(false);
            setNearMeOption(false);
            Swal.fire('Cannot get location!', 'Check your internet connection or browser setting!' ,'error');
          });
        }
        else {
          setIsLoading(false);
          setNearMeOption(false);
          Swal.fire('Geolocation is not avaialable!');
        }
    // });
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
        <div className='flex-auto flex flex-col gap-2'>
          <div className='flex gap-4 mb-4 mt-2 items-end'>
            <div className="flex flex-col flex-1">
              <label className="text-gray-800 font-medium">Search&nbsp;By:&nbsp;</label>
              <InputFormm
                id='q'
                register={()=>{}}
                errors={()=>{}}
                fullWidth
                placeholder= 'Search service...'
                style={'bg-white min-h-10 rounded-md pl-2 flex items-center border border-gray-300'}
                styleInput={'outline-none text-gray-500 italic w-full'}
                onChange={(event) => {
                  setSearchFilter(prev => { return { ...prev, term: event.target.value }; })
                }}
                value={searchFilter.term}
              >
              </InputFormm>
            </div>
            <span className='flex flex-col justify-center items-center gap-1'>
              <span className=''>
                <span className='font-semibold text-sm'>Location Search:</span>
                {/* <input className='p-3' onInput={() => {handleGetDirections()}} type="checkbox"/> */}
              </span>
              <ToggleButton handleToggleAndReturn={() => {handleGetDirections()}} isToggled={nearMeOption}/>
            </span>
            
            <div className='flex flex-col flex-1'>
              <label className="text-gray-800 font-medium">Order&nbsp;By:&nbsp;</label>
              <Select
                value={sort}
                defaultValue={""}
                name="orderBy"
                options={[
                  { value: "", label: "No Order" },
                  { value: "-price", label: "Price Descending" },
                  { value: "price", label: "Price Ascending" },
                  { value: "-totalRatings", label: "Highest Rating" }
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => setSort(e)}
              />
            </div>
            <div className='flex flex-col flex-1'>
              <label className="text-gray-800 font-medium">Categories:</label>
              <Select
                value={filterCateg}
                defaultValue={[]}
                isMulti
                name="filterCateg"
                options={svCategories}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(newVal, actionMeta) => {
                  if (actionMeta?.action === 'select-option') {
                    setFilterCateg([
                      ...newVal
                    ]);
                  }
                  else if (actionMeta?.action === 'remove-value') {
                    const newFilterCateg = filterCateg.filter(cat => cat.value !== actionMeta?.removedValue?.value);
                    setFilterCateg([...newFilterCateg]);
                  }
                  else if (actionMeta?.action === 'clear') {
                    setFilterCateg([]);
                  }
                }}
              />
            </div>

            <Button
              style="flex-1 h-fit px-4 py-2 rounded-md text-white bg-[#0a66c2] font-semibold"
              handleOnclick={() => { setSearchedClick(prev => !prev); }}
            >
            <span className="flex justify-center gap-1 items-center">
              <FaSearch /><span>Search</span>
            </span>
            </Button>

            <Button
              handleOnclick={() => {
                setSearchFilter(prev => {
                  return {
                    term: '',
                    province: '',
                    maxDistance: '',
                    orderBy: ''
                  };
                });
                setSort('');
                setFilterCateg([]);
                // setSvCategories([]);
                setResetClicked(prev => !prev);
              }}
              style="flex-1 h-fit px-4 py-2 rounded-md text-white bg-slate-400 font-semibold"
            >
              <span className="flex justify-center gap-1 items-center">
                <FaBahai /><span>Reset</span>
              </span>
            </Button>
          </div>
{/* 
          { nearMeOption &&
            <div className='flex flex-col'>
              <span className='flex justify-start items-center my-2 gap-3'>
                <label className="text-gray-800 font-medium mr-1">Max Distance:</label>
                <InputField nameKey='maxDistance'
                  value={searchFilter.maxDistance}
                  setValue={setSearchFilter}
                  placeholder={"Maximum Distance(optional)"}
                  style={'bg-white min-h-10 rounded-md pl-2 flex items-center border border-gray-300'}
                  type="number"
                />  
              </span>
            </div>
          } */}
        </div>
      </div>

      <div className={clsx('mt-8 w-main m-auto flex gap-4 flex-wrap', isShowModal ? 'hidden' : '')}>
        {(!services?.length) &&
         <p className="text-gray-600 text-center font-semibold">No service found matching your search criteria.</p>}
        {services?.map((service, index) => (
          <div key={index} className='w-[32%]'>
            <Service serviceData={service} nearMeOption={nearMeOption}/>
          </div>
        ))}
      </div>
      <div className='w-main m-auto my-4 flex justify-end'>
      {
        services?.length && <Pagination totalCount={totalServiceCount}/>
      }
      </div>
      <div className='w-full h-[50px]'>
      </div>

      { isLoading &&
        <div className='flex justify-center z-50 w-full h-full fixed top-0 left-0 items-center bg-overlay'>
          <HashLoader className='z-50' color='#3B82F6' loading={isLoading} size={80} />
        </div>
      }
    </div>

  )
}


export default Services;