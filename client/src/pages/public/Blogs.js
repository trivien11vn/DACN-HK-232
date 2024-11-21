import React, {useState, useCallback, useEffect } from 'react'
import { InputFormm, NewInputSelect, Pagination } from 'components';
import { apiGetAllBlogs, apiSearchBlogAdvanced, apiGetAllPostTags, apiGetTopProviderAuthorBlogs } from 'apis/blog';
import Button from 'components/Buttons/Button';
import { HashLoader } from 'react-spinners';
import path from 'ultils/path';
// import DOMPurify from 'dompurify';
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
// import { FaCheck, FaRegThumbsUp, FaRegThumbsDown, FaLocationArrow } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import { tinh_thanhpho } from 'tinh_thanhpho';
import { useForm } from 'react-hook-form';
import { FiBook, FiClock, FiEye, FiTag, FiThumbsDown, FiThumbsUp, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { FaSearch, FaUndo, FaBahai } from "react-icons/fa";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FaHotjar } from "react-icons/fa";

const Blogs = () => {
  const location = useLocation();
  useEffect(() => {
    // ;console.log('=========', location?.state);
    if (location?.state?.searchKey) {
      setSearchTerm(location.state.searchKey);
    }
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState([]);
  // const [sort, setSort] = useState([]);
  const [counts, setCounts] = useState(0);
  const [selectedSort, setSelectedSort] = useState('no');
  const [selectedTags, setSelectedTags] = useState([]);
  // const [provinceFilter, setProvinceFilter] = useState([]);
  // const handleSortByChange = () => {};
  const [topBlogs, setTopBlogs] = useState([]);
  const [topProviders, setTopProviders] = useState([]);

  const [searchedClick, setSearchedClick] = useState(false);
  const [resetClicked, setResetClicked] = useState(false);

  // const sortOptions = [
  //   {
  //     id: 1,
  //     value: 'createdAt',
  //     text: 'Latest'
  //   },
  //   {
  //     id: 2,
  //     value: '-createdAt',
  //     text: ' Created'
  //   },
  //   {
  //     id: 3,
  //     value: 'likes',
  //     text: 'Popular'
  //   },
  // ] 

  // const provinces = Object.entries(tinh_thanhpho).map(pair => {
  //   return {
  //     text: pair[1].name,
  //     value: pair[1].name
  //   }
  // });

  console.log(selectedTags);

  const fetchTags = async() => {
    let resp = await apiGetAllPostTags({ limit: 10, orderBy: '-numberView -likes' });
    if(resp?.success && resp?.tags){
      setTags(resp.tags)
    }
    else {
      toast.error("Some data cannot be fetch!");
    }

    // const resp = await apiGetTopBlogsWithSelectedTags({limit: 5, selectedTags:['dia-diem-an-uong','an-uong','dia-diem-vui-choi']});
    // console.log(resp.blogs);
  }
  useEffect(() => {
    fetchTags();
    setTopBlogs([1,2,3,4]);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currBlogList, setCurrBlogList] = useState([]);
  const [offset, setOffset] = useState(0);

  const fetchCurrentBlogList = async () => {
    setIsLoading(true);
    const sortBy = selectedSort.value;

    let response = await apiSearchBlogAdvanced({
      searchTerm,
      limit: 3,
      sortBy,
      selectedTags: selectedTags.map(t => t),
      offset: 0
      // categories
    });
    // let response = await await apiGetTopBlogsWithSelectedTags({limit: 5, selectedTags:['dia-diem-an-uong','an-uong','dia-diem-vui-choi']});
    console.log(response?.blogs?.hits);
  
    if(response?.success && response?.blogs?.hits){
      setCurrBlogList(response.blogs.hits);
      setCounts(response?.blogs?.total?.value);
    }
    else {
      setCurrBlogList([]);
      setCounts(0);
      Swal.fire("Error Occured!", "Cannot fetch Blog Data", "error");
    }
    setIsLoading(false);
  }
  useEffect(() => {
    // console.log('HHEHEEHEHEEHEHHE');
    fetchCurrentBlogList();
},  [searchedClick, resetClicked, selectedTags]);


useEffect(() => {
  (async () => {
    let resp = await apiGetTopProviderAuthorBlogs({limit:5});
    console.log('=====>>>'+resp.providers);
    if (resp.success && resp.providers?.length) {
      setTopProviders(resp.providers);
    }
    else {
      console.log('Cannor fetch top provider data!');
    }
  })();
}, []);

// // loadmore handler
useEffect(() => {
  if (offset === 0) { return; }

  console.log('OFFSET CHANGEEEEEEEEEEEEEEEED');

    (async () => {
      setIsLoading(true);
      const sortBy = selectedSort.value;

      let response = await apiSearchBlogAdvanced({
        searchTerm,
        limit: 3,
        sortBy,
        selectedTags: selectedTags.map(t => t),
        offset
        // categories
      });
      // let response = await await apiGetTopBlogsWithSelectedTags({limit: 5, selectedTags:['dia-diem-an-uong','an-uong','dia-diem-vui-choi']});
      if(response?.success && response?.blogs?.hits){
        setCurrBlogList(prev => [...prev, ...response.blogs.hits]);
        setCounts(response?.blogs?.total?.value);
      }
      else {
        setCurrBlogList([]);
        setCounts(0);
        Swal.fire("Error Occured!", "Cannot fetch Blog Data", "error");
      }
      setIsLoading(false);
    })();

},  [offset]);

  // const fetchTopTags = async () => {
  //   setIsLoading(true);
  //   let response = await apiGetTopTags({ limit: 5 });

  //   if(response?.success && response?.tags){
  //     setTopTags(response.tags);
  //     // setIsLoading(false);
  //   }
  //   else {

  //   }
  // }
  // useEffect(() => {
  //   fetchTopTags();
  // }, []);

  // const handleSelectSortByChange = useCallback(selectedOptions => {
  //   setSelectedSort(selectedOptions);
  // }, []);
  // const handleSelectProvinceFilterChange = useCallback(selectedOptions => {
  //   setProvinceFilter(selectedOptions);
  // }, []);
  // const handleSelectTagChange = useCallback(selectedOptions => {
  //   setSelectedTags(selectedOptions);
  // }, []);

  const handleChooseBlogPost = (id) => { 
    navigate({
      pathname:  `/${path.VIEW_POST}`,
      search: createSearchParams({id}).toString()
    })
   }
  // const multiSearchByTerm = useCallback(async () => {
  //   let response = await apiSearchBlogByParams({ searchTerm })

  //   if (response && response.success) {
  //     setCurrBlogList(response.blogs);
  //     setIsLoading(false);
  //   }
  //   else {
  //     Swal.fire('Error Ocurred!!', 'Cannot Find Blogs!!', 'error');
  //     setIsLoading(false);
  //   }
  // }, [searchTerm, selectedTags, selectedSort])
  // const multiSearchBySelectedTags = useCallback(async () => {
  //   let response = await apiSearchBlogByParams({ selectedTags, selectedSort, searchTerm });

  //   if (response && response.success) {
  //     setCurrBlogList(response.blogs);
  //     setIsLoading(false);
  //   }
  //   else {
  //     Swal.fire('Error Ocurred!!', 'Cannot create new Post Tag!!', 'error');
  //     setIsLoading(false);
  //   }
  // }, [selectedTags]);

  
  const {register,formState:{errors}, handleSubmit, watch} = useForm()
  // const [selectedTag, setSelectedTag] = useState(null);

  // console.log(currBlogList)
  return (
    <div className='w-main mb-8 mt-4 flex flex-col gap-4 overflow-y-auto'>
      <div className="grid grid-cols-4 gap-4">

          <div className='col-span-4 flex justify-start items-end gap-4 mb-2'>
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
                onChange={(event) => {setSearchTerm(event.target.value)}}
                value={searchTerm}
              >
              </InputFormm>
            </div>

            <div className='flex flex-col'>
              {/* <FaSortAmountDown />
              <NewInputSelect value={selectedSort} options={sortOptions} changeValue={(value) => {setSelectedSort(value);}} /> */}
              <label className="text-gray-800 font-medium">Order&nbsp;By:&nbsp;</label>
              {/* <select value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option value="-likes">No Order</option>
                  <option value="-likes">Liked Most</option>
                  <option value="-numberView">Most Viewed</option>
                  <option value="-createdAt">Created date</option>
              </select> */}
              <Select
                value={selectedSort}
                defaultValue={"no"}
                name="orderBy"
                options={[
                  { value: "no", label: "No Order" },
                  { value: "-createdAt", label: "Newest" },
                  { value: "likes", label: "Liked Most" },
                  { value: "-numberView", label: "Most Viewed" }
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => setSelectedSort(e)}
              />
            </div>

            <Button
              handleOnclick={() => {
                setSearchedClick(prev => !prev);
                setOffset(0);
              }}
              style="px-4 py-2 rounded-md text-white bg-blue-600 font-semibold"
            >
              <span className="flex justify-center gap-2 items-center">
                <FaSearch /><span>Search</span>
              </span>
            </Button>

            <Button
              handleOnclick={() => {
                setSelectedTags([]);
                setSearchTerm('');
                setSelectedSort('no');
                setResetClicked(prev => !prev);
                setOffset(0);
              }}
              style="px-4 py-2 rounded-md text-white bg-slate-400 font-semibold"
            >
              <span className="flex justify-center gap-2 items-center">
                <FaBahai /><span>Reset</span>
              </span>
            </Button>
          </div>

          <div className="col-span-3 max-h-[500px] overflow-y-auto scrollbar-thin">

          {/* {currBlogList?.length &&
              <Pagination totalCount={counts}/>} */}
    
            <div className="space-y-6 mt-3">
              {currBlogList?.length <= 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">No blog posts found matching your search criteria.</p>
                </div>
              ) : (
                currBlogList?.map((blog, idx) => {
                  // console.log('====', blog);
                  blog = blog['_source'];
                  return (<div
                      onClick={() => handleChooseBlogPost(blog?._id || blog?.id)}
                      key={idx}
                      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-[1.02]"
                    >
                      <div className="md:flex">
                        <div className="md:flex-shrink-0">
                          <img
                            className="h-48 w-full md:w-48 object-cover"
                            src={blog.thumb}
                            alt={blog.title}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center text-gray-500">
                              <FiUser className="h-4 w-4 mr-1" />
                              <span className="text-sm">{blog?.authorname}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiClock className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {formatDistanceToNow(new Date(blog?.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiEye className="h-4 w-4 mr-1" />
                              <span className="text-sm">{blog?.numberView}</span>
                            </div>

                            <div className="flex items-center text-gray-500">
                              <FiThumbsUp className="h-4 w-4 mr-1" />
                              <span className="text-sm">{blog?.likes}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FiThumbsDown className="h-4 w-4 mr-1" />
                              <span className="text-sm">{blog?.dislikes}</span>
                            </div>
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {blog.title}
                          </h2>
                          {/* <p className="text-gray-600 mb-4">{blog.excerpt}</p> */}
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                              >
                                <FiTag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
              )}
              {
                currBlogList?.length < counts &&
                <div className='flex justify-center gap-3'>
                  <Button
                    handleOnclick={() => {
                      setOffset(prev => prev+1);
                    }}
                    style="p-2 rounded-md text-white bg-blue-600 font-semibold flex justify-center gap-2 items-center"
                  >

                    <FaUndo /><span>Load More</span>

                  </Button>
                  <p className='flex items-center'>Total Post: {counts}</p>
                </div>
              }
            </div>
            <div className='w-main m-auto my-4 flex justify-end'>
            </div>
          </div>

          {/* Tags - Right Side */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4"><FaHotjar />Popular Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <button
                    key={tag?._id}  
                    value={tag?._id}
                    onClick={(e) => {
                      // console.log(e.target.getAttribute("value"));
                      const selectedVal = e.target.getAttribute("value");
                      setSelectedTags(prev => {
                        console.log(prev);
                        if (!prev.includes(selectedVal)) {
                          return [...prev, selectedVal];
                        }
                        return prev.filter(t => t !== selectedVal);
                      });
                    }}
                    className={`flex gap-2 items-center px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag?._id)
                        ? "bg-slate-400 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <span className='flex gap-2' value={tag?._id}>
                      <FiTag className="h-3 w-3 mr-1 mt-1" value={tag?._id}/>{tag?._id}
                    </span>
                    <span className='flex gap-1' value={tag?._id}>
                      <FiEye className="h-3 w-3 mt-1 text-[#0a66c2]" value={tag?._id}/>{tag?.tagViewCount}
                      <FiBook className="h-3 w-3 mt-1 text-amber-500" value={tag?._id}/>{tag?.tagCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4"><FaHotjar />Popular Provider Author:</h2>
                {topProviders?.map(provider => (
                  <div>
                  </div>
                ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Blogs; 