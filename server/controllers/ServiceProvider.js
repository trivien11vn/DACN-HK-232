const ServiceProvider = require('../models/ServiceProvider')
const asyncHandler = require('express-async-handler')

const createServiceProvider = asyncHandler(async(req, res)=>{
    // const { email, password, firstName, lastName, mobile } = req.body
    // if(!email || !password || !firstName || !lastName || !mobile){
    //     return res.status(400).json({
    //         success: false,
    //         mes: "Missing input"
    //     })}
    
    // const user = await User.findOne({email})
    // if(user){
    //     return res.status(400).json({
    //         success: false,
    //         mes: "User has existed already"
    //     })}

    // const token = makeToken()
    // const email_edit = btoa(email) + '@' + token
    // const newUser = await User.create({
    //     email:email_edit,password,firstName,lastName,mobile
    // })
    // // res.cookie('dataregister', {...req.body, token}, {httpOnly: true, maxAge: 15*60*1000})

    // if(!newUser){
    //     return res.status(400).json({
    //         success: false,
    //         mes: "Error creating user"
    //     })
    // }


    const { bussinessName, province } = req.body
    if (!bussinessName || !province ) {
        return res.status(400).json({
            success: false,
            mes: "Missing Input On Provider"
        })
    }

    const bname = await ServiceProvider.findOne({bussinessName})
    if(bname){
        return res.status(400).json({
            success: false,
            mes: "Provider name has existed already"
        })}

    const response = await ServiceProvider.create({
        ...req.body,
        success: true,
    });

    // const html = `<h2>Register code: </h2><br /><blockquote>${token}</blockquote>`
    // await sendMail({email, html, subject: 'Complete Registration'})

    return res.status(201).json({
        success: response ? true : false,
        mes: "Created Provider and Account Successful"
    })
})

const getAllServiceProvider = asyncHandler(async(req, res)=>{
    const response = await ServiceProvider.find().select('-createdAt -updatedAt')
    return res.status(200).json({
        success: response ? true : false,
        AllServiceProviders: response ? response : "Cannot get all coupons"
    })
})

const updateServiceProvider = asyncHandler(async(req, res)=>{
    const {cid} = req.params
    if(Object.keys(req.body).length === 0){
        throw new Error('Missing input')
    }
    if(req.body.expiry){
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    }
    const response = await ServiceProvider.findByIdAndUpdate(cid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedServiceProvider: response ? response : "Cannot update a coupon"
    })
})


const deleteServiceProvider = asyncHandler(async(req, res)=>{
    const {cid} = req.params
    const response = await ServiceProvider.findByIdAndDelete(cid)
    return res.status(200).json({
        success: response ? true : false,
        deletedServiceProvider: response ? response : "Cannot delete service provider"
    })
})

module.exports = {
    createServiceProvider,
    getAllServiceProvider,
    updateServiceProvider,
    deleteServiceProvider
}