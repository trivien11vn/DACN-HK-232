import axios from '../axios'
export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'post',
    data,
})
export const apiFinalRegister = (token) => axios({
    url: '/user/final_register/'+token,
    method: 'put',
})
export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'post',
    data
})
export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'post',
    data
})
export const apiResetPassword = (data) => axios({
    url: '/user/reset_password',
    method: 'put',
    data
})
export const apiGetCurrent = () => axios({
    url: '/user/current',
    method: 'get'
})

export const apiGetUserById = ({userId}) => axios({
    url: '/user/getUser/' + userId,
    method: 'get'
})

export const apiUsers = (params) => axios({
    url: '/user/',
    method: 'get',
    params
})

export const apiModifyUser = (data, uid) => axios({
    url: '/user/'+uid,
    method: 'put',
    data
})

export const apiDeleteUser = (uid) => axios({
    url: '/user/'+uid,
    method: 'delete'
})

export const apiUpdateCurrent = (data) => axios({
    url: '/user/current',
    method: 'put',
    data
})

export const apiUpdateCartService = (data) => axios({
    url: '/user/cart_service',
    method: 'put',
    data
})

export const apiUpdateCartProduct = (data) => axios({
    url: '/user/cart_product',
    method: 'put',
    data
})


export const apiUpdateWishlist = ({sid}) => axios({
    url: `/user/wishlist/${sid}`,
    method: 'put',
})

export const apiUpdateWishlistProduct = ({pid}) => axios({
    url: `/user/wishlistProduct/${pid}`,
    method: 'put',
})


export const apiRemoveCartProduct = (pid, colorCode, variantId) => axios({
    url: '/user/remove_cart_product',
    method: 'delete',
    params: {
        pid: pid,
        colorCode: colorCode,
        variantId: variantId
    }
})

export const apiGetAllContact = (userId) => axios({
    url: `/user/getAllContact/${userId}`,
    method: 'get',
})

export const apiAddContactToCurrentUser = (data) => axios({
    url: `/user/add_contact`,
    method: 'post',
    data
})

export const apiGetAdminData = (params) => axios({
    url: `/user/admin_data`,
    method: 'get',
    params
})

export const apiUserAcceptTermAndConditions = () => axios({
    url: `/user/accept_tac`,
    method: 'get'
})