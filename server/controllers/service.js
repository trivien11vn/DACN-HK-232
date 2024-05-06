const Service = require('../models/service')
const asyncHandler = require("express-async-handler")


const createService = asyncHandler(async(req, res)=>{
    const {name, price, description, category, assigned_staff, hour, minute, provider_id} = req.body

    console.log('----call api----')
    console.log({name, price, description, category, assigned_staff, hour, minute})

    const thumb = req.files?.thumb[0]?.path
    const image = req.files?.images?.map(el => el.path)

    if(!name || !price || !description || !assigned_staff || !category || !hour || !minute || !provider_id){
        throw new Error("Missing input")
    }
    req.body.duration = +hour*60 + +minute
    if(thumb) req.body.thumb = thumb
    if(image) req.body.image = image
    const newService = await Service.create(req.body)
    return res.status(200).json({
        success: newService ? true : false,
        mes: newService ? 'Created successfully' : "Cannot create new service"
    })
})

// get all staffs
const getAllServicesByAdmin = asyncHandler(async (req, res) => {
    // const {provider_id} = req.user

    const queries = { ...req.query };

    // Loại bỏ các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các toán tử cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );

    // chuyen tu chuoi json sang object
    const formatedQueries = JSON.parse(queryString);
    //Filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.title, $options: 'i' };
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' };
    let queryFinish = {}
    if(queries?.q){
        delete formatedQueries.q
        queryFinish = {
            $or: [
                {name: {$regex: queries.q, $options: 'i' }},
                {category: {$regex: queries.q, $options: 'i' }},
            ]
        }
    }
    const qr = {...formatedQueries, ...queryFinish}
    let queryCommand =  Service.find(qr).populate({
        path: 'assigned_staff',
        select: 'firstName lastName avatar',
    })
    try {
        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            queryCommand.sort(sortBy)
        }

        //filtering
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            queryCommand.select(fields)
        }

        //pagination
        //limit: so object lay ve 1 lan goi API
        //skip: n, nghia la bo qua n cai dau tien
        //+2 -> 2
        //+dgfbcxx -> NaN
        const page = +req.query.page || 1
        const limit = +req.query.limit || process.env.LIMIT_PRODUCT
        const skip = (page-1)*limit
        queryCommand.skip(skip).limit(limit)


        const services = await queryCommand
        const counts = await Service.countDocuments(qr);
        return res.status(200).json({
            success: true,
            counts: counts,
            services: services,
            });
        
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({
        success: false,
        error: 'Cannot get services',
        });
    }
})

// get all staffs
const deleteServiceByAdmin = asyncHandler(async (req, res) => {
    const {sid} = req.params
    const service = await Service.findByIdAndDelete(sid)
    return res.status(200).json({
        success: service ? true : false,
        mes: service ? 'Deleted successfully' : "Cannot delete service"
    })
})

const updateServiceByAdmin = asyncHandler(async(req, res)=>{
    const {sid} = req.params

    const files = req?.files
    if(files?.thumb){
        req.body.thumb = files?.thumb[0]?.path
    }
    if(files?.images){
        req.body.image = files?.images?.map(el => el.path)
    }
    const service = await Service.findByIdAndUpdate(sid, req.body, {new: true})
    return res.status(200).json({
        success: service ? true : false,
        mes: service ? 'Updated successfully' : "Cannot update service"
    })
})
//update staff by admin
// const updateStaffByAdmin = asyncHandler(async (req, res) => {
//     const {staffId} = req.params
//     console.log(req.body)
//     if(!staffId || Object.keys(req.body).length === 0){
//         throw new Error("Missing input")
//     }
//     else{
//         const response = await Staff.findByIdAndUpdate(staffId, req.body, {new: true}).select('-refresh_token -password -role')
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ? `Staff with email ${response.email} updated successfully` : "Something went wrong"
//         })
//     }
// })

// delete staff by admin
// const deleteStaffByAdmin = asyncHandler(async (req, res) => {
//     const {staffId} = req.params
//     if(!staffId){
//         throw new Error("Missing input")
//     }
//     else{
//         const response = await Staff.findByIdAndDelete(staffId)  
//         return res.status(200).json({
//             success: response ? true : false,
//             mes: response ? `Staff with email ${response.email} deleted successfully` : "Something went wrong"
//         })
//     }
// })


// get all staffs
const getAllServicesPublic = asyncHandler(async (req, res) => {
    // const {provider_id} = req.user

    const queries = { ...req.query };

    // Loại bỏ các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các toán tử cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );

    // chuyen tu chuoi json sang object
    const formatedQueries = JSON.parse(queryString);
    //Filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.title, $options: 'i' };
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' };
    let queryFinish = {}
    if(queries?.q){
        delete formatedQueries.q
        queryFinish = {
            $or: [
                {name: {$regex: queries.q, $options: 'i' }},
                {category: {$regex: queries.q, $options: 'i' }},
            ]
        }
    }
    const qr = {...formatedQueries, ...queryFinish}
    let queryCommand =  Service.find(qr).populate({
        path: 'assigned_staff',
        select: 'firstName lastName avatar',
    })
    try {
        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            queryCommand.sort(sortBy)
        }

        //filtering
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            queryCommand.select(fields)
        }

        //pagination
        //limit: so object lay ve 1 lan goi API
        //skip: n, nghia la bo qua n cai dau tien
        //+2 -> 2
        //+dgfbcxx -> NaN
        const page = +req.query.page || 1
        const limit = +req.query.limit || process.env.LIMIT_PRODUCT
        const skip = (page-1)*limit
        queryCommand.skip(skip).limit(limit)


        const services = await queryCommand
        const counts = await Service.countDocuments(qr);
        return res.status(200).json({
            success: true,
            counts: counts,
            services: services,
            });
        
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({
        success: false,
        error: 'Cannot get services',
        });
    }
})


module.exports = {
    createService,
    getAllServicesByAdmin,
    deleteServiceByAdmin,
    updateServiceByAdmin,
    getAllServicesPublic
}