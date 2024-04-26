const Staff = require('../models/staff')
const asyncHandler = require("express-async-handler")


const addStaff = asyncHandler(async(req, res)=>{
    console.log(req.body)
    const {firstName, lastName, email, mobile} = req.body
    const data = {firstName, lastName, mobile, email}
    console.log(data)
    if(req.file){
        data.avatar = req.file.path
    }
    if(!firstName || !lastName || !mobile || !email){
        throw new Error("Missing input")
    }
    else{
        const response = await Staff.create(data)
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Created successfully' : "Cannot create new staff"
        })
    }
})

// get all staffs
const getAllStaffs = asyncHandler(async (req, res) => {
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
    // Filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' };  
    if (req.query.q){
        delete formatedQueries.q
        formatedQueries['$or'] = [
            {firstName : { $regex: req.query.q, $options: 'i' }},
            {lastName : { $regex: req.query.q, $options: 'i' }},
            {email : { $regex: req.query.q, $options: 'i' }},
        ]
    }
    let queryCommand =  Staff.find(formatedQueries)
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


        const staffs = await queryCommand
        const counts = await Staff.countDocuments(formatedQueries);
        return res.status(200).json({
            success: true,
            counts: counts,
            staffs: staffs,
            });
        
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({
        success: false,
        error: 'Cannot get staffs',
        });
    }
})

//update user by admin
const updateStaffByAdmin = asyncHandler(async (req, res) => {
    const {staffId} = req.params
    console.log(req.body)
    if(!staffId || Object.keys(req.body).length === 0){
        throw new Error("Missing input")
    }
    else{
        const response = await Staff.findByIdAndUpdate(staffId, req.body, {new: true}).select('-refresh_token -password -role')
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? `Staff with email ${response.email} updated successfully` : "Something went wrong"
        })
    }
})

module.exports = {
    addStaff,
    getAllStaffs,
    updateStaffByAdmin
}