import React, {useState,useEffect} from 'react'
import { Button, MultiSelect } from '../../components'
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { apiGetOneBlog, apiLikeBlog, apiDislikeBlog, apiUpdateViewBlog, apiGetTopBlogsWithSelectedTags } from '../../apis/blog'
// import { apiGetOneBlog, apiGetTopBlogsWithSelectedTags, apiLikeBlog, apiDislikeBlog, apiUpdateViewBlog } from '../../apis/blog'
import { apiCreateNewBlogComment, apiCreateReplyComment, apiGetAllBlogComment, apiGetAllReplyComment, apiReactComment } from '../../apis/blogComments'
import DOMPurify from 'dompurify';
import path from 'ultils/path';
import { FaRegTrashAlt, FaRegThumbsDown, FaRegThumbsUp, FaClock, FaPencilAlt, FaBackward, FaHome, FaFacebook, FaHeart, FaSadTear, FaAngry, FaLaughBeam } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { FaGithub } from 'react-icons/fa6'
import ServiceBlogIntroCard from '../../components/Services/ServiceBlogIntroCard'
import Swal from 'sweetalert2'
import avatar from 'assets/avatarDefault.png'
import { FiChevronDown, FiClock, FiCornerDownRight, FiEye, FiMessageSquare, FiSend, FiShare2, FiTag, FiThumbsDown, FiThumbsUp, FiUser, FiX } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import defaultProvider from '../../assets/defaultProvider.jpg'
import avatarDefault from '../../assets/avatarDefault.png'

const ViewBlog = () => {
    // const dispatch = useDispatch()
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const {current} = useSelector(state => state.user)
    const {isLogin} = useSelector(state => state.user)
    const [commentList, setCommentList] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [allReplyComments, setAllReplyComments] = useState([])
    const [showReactions, setShowReactions] = useState(null);
    const [currBlogList, setCurrBlogList] = useState([]);
    const [showReplyReactions, setShowReplyReactions] = useState(null);
    const [showUserReaction, setshowUserReaction] = useState({
      typeReact: '',
      commentId: ''
    })

    const reactions = [
      { label: "Like", },
      { label: "Love", },
      { label: "Love_love"},
      { label: "Haha", },
      { label: "Wow", },
      { label: "Sad", },
      { label: "Angry", },
    ];

    const fetchCurrentBlogList = async () => {
      // setIsLoading(true);
      let response = await apiGetTopBlogsWithSelectedTags({ limit: 5, selectedTags: [] });
      if(response?.success && response?.blogs){
        setCurrBlogList(response.blogs);
        // setIsLoading(false);
      }
      else {
  
      }
    }
    // const fetchSuggestedBlogs = async () => {
    //   let response = await ;
    // };
    useEffect(() => {
      fetchCurrentBlogList();
    }, []);

    const fetchCurrentBlogCommentList = async () => {
      // setIsLoading(true);
      let response = await apiGetAllBlogComment({ blogCommentId: params?.get('id')});
      if(response?.success){
        setCommentList(response?.allComments);
        // setIsLoading(false);
      }
      else {
  
      }
    }
    useEffect(() => {
      fetchCurrentBlogCommentList();
    }, []);
  

    const fetchCurrentReplyComment = async () => {
      // setIsLoading(true);
      let response = await apiGetAllReplyComment({ blogCommentId: params?.get('id')});
      if(response?.success){
        setAllReplyComments(response?.replies);
        // setIsLoading(false);
      }
      else {
  
      }
    }
    useEffect(() => {
      fetchCurrentReplyComment();
    }, []);


    const fetchPostData = async () => {
      const response = await apiGetOneBlog(params?.get('id'));
      if (response?.success) {
        setPost(response?.blog);
        if (response?.blog?.likes?.includes(current?._id)) {
          setLiked(true);
        }
        if (response?.blog?.dislikes?.includes(current?._id)) {
          setDisliked(true);
        }
      } else {
  
      }
      // setPost()
    };
  
    useEffect(() => {
      const searchParams = Object.fromEntries([...params]);
      fetchPostData(searchParams);
    }, [params]);

    const updateViewBlog = async(bid) => {
      await apiUpdateViewBlog(bid)
    }
    useEffect(() => {
      updateViewBlog(params?.get('id'));
      fetchPostData()
    }, []);
    
    const backToHomepage = () => {
        navigate({
            pathname: `/${path.BLOGS}`
        })
    }

    const triggerReaction = async (reaction) => {
      if (reaction === 'like') {
        let response = await apiLikeBlog({_id: current?._id, bid: params?.get('id') });

        if (!response?.success) {
          Swal.fire('Error Ocurred!!', 'Like This Post Not Success!!', 'error')
          setLiked(false);
        }
        else {
          setPost(response.rs);
        }
      }
      else if (reaction === 'dislike') {
        let response = await apiDislikeBlog({_id: current?._id, bid: params?.get('id') });

        if (!response?.success) {
          Swal.fire('Error Ocurred!!', 'Dislike This Post Not Success!!', 'error');
          setDisliked(false);
        }
        else {
          setPost(response.rs);
        }
      }
    }

    const [newComment, setNewComment] = useState("");
    const handleCommentSubmit = async(e) => {
      e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
      if(newComment.length > 0){
        if (!isLogin) {
          Swal.fire('Unauthorized', 'Please Login To Write Comments!!', 'error');
          navigate({
            pathname: `/${path.LOGIN}`
          });
          return;
        }
        else{
          const response = await apiCreateNewBlogComment({comment: newComment, blog: params?.get('id'), postedBy: current?._id, updatedAt:Date.now()});
          if (!response?.success) {
            Swal.fire('Oops...', 'Error Making Comments!!', 'error')
          }
          else {
            setNewComment('');
            fetchCurrentBlogCommentList();
          }
        }
      }
    }

    const handleReplySubmit = async(commentId) => {
      if(replyContent.length > 0) {
        if (!isLogin) {
          Swal.fire('Unauthorized', 'Please Login To Write Comments!!', 'error');
          navigate({
            pathname: `/${path.LOGIN}`
          });
          return;
        }
        else{
          const response = await apiCreateReplyComment({comment: replyContent, blog: params?.get('id'), postedBy: current?._id, updatedAt:Date.now(), parent: commentId})
          if(!response?.success){
            Swal.fire('Oops...', 'Error Making Comments!!', 'error')
          }
          else{
            setReplyContent('');
            fetchCurrentBlogCommentList();
            fetchCurrentReplyComment()
            setReplyingTo(null)
          }
        }
      }
    };

    const [expandedComments, setExpandedComments] = useState([]);
    const toggleReplies = (commentId) => {
      setExpandedComments(prev =>
        prev.includes(commentId)
          ? prev.filter(id => id !== commentId)
          : [...prev, commentId]
      );
    };



    const ReactionPopup = ({ commentId }) => (
      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl flex space-x-1 transition-all duration-200 transform scale-100">
        {reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => handleReaction(commentId, reaction?.label)}
            className={`p-1 rounded-full hover:bg-blue-100 transition-colors duration-200`}
            title={reaction?.label}
          >
            {
              reaction?.label === 'Like' ? 
                <span className='text-lg'>👍</span>
              : 
              reaction?.label === 'Love' ?
                <span className='text-lg'>❤️</span>
              :
              reaction?.label === 'Love_love' ?
                <span className='text-lg'>🥰</span>
              :
              reaction?.label ===  'Haha'?
                <span className='text-lg'>😁</span>
              :
              reaction?.label ===  'Wow' ?
                <span className='text-lg'>😮</span>
              :
              reaction?.label ===  'Sad' ?
                <span className='text-lg'>😢</span>
              :
                <span className='text-lg'>😡</span>
            }
          </button>
        ))}
      </div>
    );
  
    // const ReactionSummary = ({ reactionData }) => (
    //   <div className="flex items-center space-x-3 justify-end">
    //     {Object.entries(reactionData).map(([type, count]) => {
    //       const reactionConfig = reactions.find(r => r.label === type);
    //       if (!reactionConfig) return null;
    //       const Icon = reactionConfig.icon;
    //       return (
    //         <div key={type} className="flex items-center space-x-1">
    //           <Icon className="w-4 h-4" style={{ color: reactionConfig.color }} />
    //           <span className="text-sm text-gray-600">{count}</span>
    //         </div>
    //       );
    //     })}
    //   </div>
    // );

    const handleReaction = async(commentId, reactionType) => {
      const response = await apiReactComment({blogCommentId: commentId, reactionType: reactionType.toLowerCase()});
      if(response?.success){
        fetchCurrentBlogCommentList();
        fetchCurrentReplyComment();
      }
    };

    console.log(current?._id)
    console.log(commentList)

    return (
      <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={post?.thumb}
            alt={post?.title}
            className="w-full h-auto object-cover"
          />
          <div className="flex items-center space-x-4 px-6 py-3">
              <div className="relative">
                <img
                  src={post?.provider_id?.images[0] || defaultProvider}
                  alt={post?.provider_id?.bussinessName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 href={``}
                  className="text-xl font-bold text-[#00143c] hover:underline cursor-pointer">
                    {post?.provider_id?.bussinessName}
                </h2>
              </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <button
                   onClick={() => {
                      setLiked(prev => !prev);
                      setDisliked(false);
                      triggerReaction("like"); }}
                  className={liked ? "flex items-center space-x-2 text-blue-600" : "flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"}
                >
                  <FiThumbsUp className="h-6 w-6" />
                  <span className="font-medium">{post?.likes?.length || 0}</span>
                </button>
                <button
                  onClick={() => {
                      setDisliked(prev => !prev);
                      setLiked(false);
                      triggerReaction("dislike"); }}
                  className={disliked ? "flex items-center space-x-2 text-red-600" : "flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"}
                >
                  <FiThumbsDown className="h-6 w-6" />
                  <span className="font-medium">{post?.dislikes?.length || 0}</span>
                </button>
                <div className="flex items-center text-gray-600">
                  <FiEye className="h-6 w-6 mr-2" />
                  <span className="font-medium">{post?.numberView}</span>
                </div>
              </div>
              <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <FiShare2 className="h-6 w-6" />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-[#00143c] mb-4">
              {post?.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-8">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 mr-2" />
                <span>{`${post?.author?.lastName} ${post?.author?.firstName}`}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="h-5 w-5 mr-2" />
                <span>
                  {post?.createdAt ? (
                    formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })
                  ) : (
                    'Không rõ thời gian'
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post?.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <FiTag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {post?.content?.length === 1 
              &&
              <div id='post_content' className='text-lg text-left rounded-md shadow-md' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post?.content[0])}}>
              </div>
            }
          </div>

          <div className="border-t py-8 px-6">
            <h2 className="text-2xl font-bold text-[#00143c] mb-6 flex items-center">
              <FiMessageSquare className="h-6 w-6 mr-2" />
              Comments
            </h2>
            {/* New Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <img className='w-10 h-10 object-cover rounded-full' src={current?.avatar || avatarDefault}/>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="border rounded-lg overflow-hidden">
                      <textarea
                        rows="3"
                        className="block w-full resize-none border-0 py-3 px-4 placeholder-gray-500 outline-none sm:text-sm"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="border-t p-2 bg-gray-50">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FiSend className="mr-2" />
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </form>

            <div className="space-y-6">
              {commentList?.map((comment) => (
                <div key={comment?._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={comment?.postedBy?.avatar || avatarDefault}
                        alt={'avtar_user'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="font-medium text-gray-900">{`${comment?.postedBy?.lastName} ${comment?.postedBy?.firstName}`}</div>
                    </div>
                    <div className="text-sm text-gray-500">{formatDistanceToNow(new Date(comment?.createdAt), { addSuffix: true })}</div>
                  </div>
                  <p className="text-gray-700">{comment?.comment}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowReactions(comment._id)}
                          className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          {
                            comment?.like?.some(item => item?._id === current?._id) ?
                              <span>👍</span>
                            : 
                            comment?.love?.some(item => item?._id === current?._id) ?
                              <span>❤️</span>
                            :
                            comment?.love_love?.some(item => item?._id === current?._id) ?
                              <span>🥰</span>
                            :
                            comment?.haha?.some(item => item?._id === current?._id) ?
                              <span>😁</span>
                            :
                            comment?.wow?.some(item => item?._id === current?._id) ?
                              <span>😮</span>
                            :
                            comment?.sad?.some(item => item?._id === current?._id) ?
                              <span>😢</span>
                            :
                            comment?.angry?.some(item => item?._id === current?._id) ?
                              <span>😡</span>
                            :
                            <FiThumbsUp className="mr-1" />
                          }
                        </button>
                        {showReactions === comment._id && (
                          <div 
                            onMouseLeave={() => setShowReactions(null)}
                            className="absolute top-20 left-[-10px] mb-2"
                          >
                            <ReactionPopup commentId={comment._id} />
                          </div>
                        )}
                      </div>

                      {replyingTo !== comment._id && (
                        <button
                          onClick={() => setReplyingTo(comment._id)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FiCornerDownRight className="mr-2" />
                          Reply
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-2 relative'>
                      {comment?.like?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'like', commentId: comment?._id})}}>👍{comment?.like?.length}</span>}
                      {comment?.love?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'love', commentId: comment?._id})}} >❤️{comment?.love?.length}</span>}
                      {comment?.love_love?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'love_love', commentId: comment?._id})}}>🥰{comment?.love_love?.length}</span>}
                      {comment?.haha?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'haha', commentId: comment?._id})}}>😁{comment?.haha?.length}</span>}
                      {comment?.wow?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'wow', commentId: comment?._id})}}>😮{comment?.wow?.length}</span>}
                      {comment?.sad?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'sad', commentId: comment?._id})}}>😢{comment?.sad?.length}</span>}
                      {comment?.angry?.length > 0 && <span className='text-sm text-gray-600 cursor-pointer' onClick={()=>{setshowUserReaction({typeReact:'angry', commentId: comment?._id})}}>😡{comment?.angry?.length}</span>}
                      {
                        showUserReaction?.type !== '' && showUserReaction?.commentId === comment?._id && 
                        <div className='w-[200px] h-fit max-h-[300px] right-0 top-6 absolute overflow-y-auto bg-white rounded-lg shadow-xl p-4'>
                          <div className='flex justify-between items-center w-full text-[#00143c] mb-3'>
                            <span className='font-semibold'>
                              Reaction: {showUserReaction?.typeReact === 'like' ? <span>👍</span> : showUserReaction?.typeReact === 'love' ? <span>❤️</span> : showUserReaction?.typeReact === 'love_love' ? <span>🥰</span> : showUserReaction?.typeReact === 'haha' ? <span>😁</span> : showUserReaction?.typeReact === 'wow' ? <span>😮</span> : showUserReaction?.typeReact === 'sad' ? <span>😢</span> : <span>😡</span>}
                            </span>
                            <button
                              onClick={() => setshowUserReaction({typeReact:'', commentId: ''})}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </div>
                          <div className='flex flex-col gap-2'>
                            {comment?.[showUserReaction?.typeReact]?.map((user) => (
                              <div key={user?._id} className='flex items-center gap-2'>
                                <img src={user?.avatar || avatarDefault} className='w-8 h-8 rounded-full object-cover'/>
                                <span className='text-[#00143c] text-sm'>{`${user?.lastName} ${user?.firstName}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                      <div className="mt-4 ml-8">
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <img src={current?.avatar || avatarDefault} className='w-8 h-8 rounded-full object-cover'/>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="border rounded-lg overflow-hidden">
                              <textarea
                                rows="2"
                                className="block w-full resize-none py-2 px-3 placeholder-gray-500 sm:text-sm outline-none"
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                              />
                              <div className="border-t p-2 bg-gray-50 flex justify-between">
                                <button
                                  onClick={() => handleReplySubmit(comment._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                  <FiSend className="mr-2" />
                                  Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                  <FiX className="mr-2" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  
                  {/* Replies */}
                  {allReplyComments[comment?._id]?.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4">
                        <div key={allReplyComments[comment?._id][0]._id} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src={allReplyComments[comment?._id][0]?.postedBy?.avatar || avatarDefault}
                                alt={'avatar_user'}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="font-medium text-gray-900">{`${allReplyComments[comment?._id][0]?.postedBy?.lastName} ${allReplyComments[comment?._id][0]?.postedBy?.firstName}`}</div>
                            </div>
                            <div className="text-sm text-gray-500">{formatDistanceToNow(new Date(allReplyComments[comment?._id][0]?.createdAt), { addSuffix: true })}</div>
                          </div>
                          <p className="text-gray-700 pl-11">{allReplyComments[comment?._id][0]?.comment}</p>
                        </div>

                        {/* Show load more button if there are more replies */}
                        {allReplyComments[comment?._id]?.length > 1 && (
                          <button
                            onClick={() => toggleReplies(comment?._id)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors ml-2"
                          >
                            <FiChevronDown className="mr-1" />
                            {expandedComments.includes(comment?._id)
                              ? "Hide replies"
                              : `Show ${allReplyComments[comment?._id]?.length - 1} more ${allReplyComments[comment?._id]?.length - 1 === 1 ? "reply" : "replies"}`
                            }
                          </button>
                        )}

                        {/* Show remaining replies if expanded */}
                        {expandedComments.includes(comment?._id) && allReplyComments[comment?._id]?.slice(1).map((reply) => (
                          <div key={reply._id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={reply?.postedBy?.avatar || avatarDefault}
                                  alt={'avatar_user'}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="font-medium text-gray-900">{`${reply?.postedBy?.lastName} ${reply?.postedBy?.firstName}`}</div>
                              </div>
                              <div className="text-sm text-gray-500">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</div>
                            </div>
                            <p className="text-gray-700 pl-11">{reply?.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
    )
}

export default ViewBlog