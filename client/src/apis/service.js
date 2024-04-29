import axios from '../axios'
export const apiAddService = (data) => axios({
    url: '/service/',
    method: 'post',
    data,
})

export const apiGetServiceByAdmin = (params) => axios({
    url: '/service/',
    method: 'get',
    params,
})

export const apiDeleteServiceByAdmin = (sid) => axios({
    url: '/service/'+sid,
    method: 'delete',
})

export const apiUpdateServiceByAdmin = (data, sid) => axios({
    url: '/service/'+sid,
    method: 'put',
    data
})