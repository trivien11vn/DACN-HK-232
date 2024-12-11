const ServiceProvider = require('../models/ServiceProvider')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const makeToken = require('uniqid')
const mongoose = require('mongoose');
const sendMail = require('../ultils/sendMail');
const crypto = require('crypto');
const ES_CONSTANT = require('../services/constant');
const esDBModule = require('../services/es');
const ESReplicator = require('../services/replicate');


const makeTokenNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã 6 chữ số
};

const createServiceProvider = asyncHandler(async(req, res)=>{
    console.log(req.body)
    const { email, password, firstName, lastName, mobile } = req.body
    const avatar = req.files?.avatar[0]?.path

    if(!email || !password || !firstName || !lastName || !mobile){
        return res.status(400).json({
            success: false,
            mes: "Missing input"
        })}
    
    let user = await User.findOne({email})
    if(user){
        return res.status(400).json({
            success: false,
            mes: "User has existed already"
        })}

    const token = makeTokenNumber()
    const email_edit = btoa(email) + '@' + token
    const newUser = await User.create({
        email:email_edit,password,firstName,lastName,mobile,avatar
    })

    if(!newUser){
        return res.status(400).json({
            success: false,
            mes: "Error creating user"
        })
    }
    else{
        setTimeout(async()=>{
            await User.deleteOne({email: email_edit})
        },[15*60*1000])
    }

    const { bussinessName, address } = req.body
    if (!bussinessName || !address ) {
        return res.status(400).json({
            success: false,
            mes: "Missing Input On Provider"
        })
    }

    const images = req.files?.images[0]?.path
    console.log(images)
    req.body.images = images

    const bname = await ServiceProvider.findOne({bussinessName})
    if(bname){
        return res.status(400).json({
            success: false,
            mes: "Provider name has existed already"
        })
    }


    const newProvider = await ServiceProvider.create({
        ...req.body,
        bussinessName:  bussinessName + "@" + token
    });

    if (!newProvider) {
        // console.log('test333')
        res.status(400).json({
            success: false,
            mes: "Cannot Create Provider Register"
        })
    }
    else{
        // console.log('test444')
        setTimeout(async()=>{
            await ServiceProvider.deleteOne({bussinessName: req.body.bussinessName + "@" + token})
        },[15*60*1000]);


        const payload = newProvider.toObject(); // if modify output from mongoose, use this
            // console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbp', payload);
        const esResult = await ESReplicator.addProvider(payload);

        if (!esResult.success || !esResult.data) {
            await ServiceProvider.findByIdAndUpdate(newProvider._id, { synced: false });
            // throw new Error('Canceled update for unresponsed Elastic Connection');
    
            return res.status(200).json({
                success: true,
                mes: 'Created successfully but temporairily unavailable to search, contact support'
            });
        }
    }

    user = await User.findOne({mobile: req?.body?.mobile})
    if(!user){
        res.status(400).json({
            success: false,
            mes: "Invalid Request For Provider Register"
        })
        return
    }
    const userUpdated = await User.updateOne({mobile: req?.body?.mobile}, { provider_id: newProvider.id, role: 1411 })

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0a66c2; text-align: center;">Complete Your Registration</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Thank you for registering with us! To complete your registration, please use the following verification code:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #0a66c2; padding: 10px 20px; background-color: #f7f7f7; border: 2px solid #0a66c2; border-radius: 8px; display: inline-block;">
                ${token}
            </span>
        </div>
        <p style="font-size: 16px;">This code is valid for 15 minutes. If you didn’t request this, please ignore this email.</p>
        <p style="font-size: 16px;">Best regards,<br>Your Company Team</p>
    </div>
    `;
    await sendMail({email, html, subject: 'Complete Registration'})

    return res.status(201).json({
        success: newProvider ? true : false,
        mes: "Created Provider and Account Successful"
    })
})

const finalRegisterProvider = asyncHandler(async(req, res)=>{
    const {token} = req.params
    const notActiveEmail = await User.findOne({email:new RegExp(`${token}$`)})
    const notActiveProvider = await ServiceProvider.findOne({bussinessName:new RegExp(`${token}$`)})
    if(notActiveEmail){
        notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0])
        notActiveEmail.save()
    }
    if(notActiveProvider){
        notActiveProvider.bussinessName = notActiveProvider?.bussinessName?.split("@")[0]
        notActiveProvider.save()
    }
    return res.json({
        success: (notActiveEmail && notActiveProvider) ? true : false,
        mes: (notActiveEmail && notActiveProvider) ? "Successfully" : "Something went wrong"
    })
})


const getAllServiceProvider = asyncHandler(async(req, res) => {
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
    
    let queryCommand = ServiceProvider.find(formatedQueries).select('-createdAt -updatedAt');
    
    try {
        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            queryCommand.sort(sortBy);
        } else {
            // Sort by createdAt in descending order if no sort query is provided
            queryCommand.sort('-createdAt');
        }

        //pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
        const skip = (page - 1) * limit;
        queryCommand.skip(skip).limit(limit);

        const response = await queryCommand;
        const counts = await ServiceProvider.countDocuments(formatedQueries);
        
        return res.status(200).json({
            success: true,
            counts: counts,
            AllServiceProviders: response ? response : "Cannot get all coupons",
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Cannot get all service providers',
        });
    }
})


const updateServiceProviderWithDocs = asyncHandler(async(req, res)=>{
    const spid = req.params.spid
    console.log('vuivuiuviuv', req.body, spid);
    if(Object.keys(req.body).length === 0){
        throw new Error('Missing input');
    }

    console.log('files: ', req.file);
    if(req.file){
        console.log('file: ', req.file);
        req.body.document = req.file.filename;
        // console.log('HAS FILE');
        // req.body.images = [req.files.avatar.path];
    }
    // if(req.files){
    //     console.log('file: ', req.files);
    //     // req.body.images = [req.file.path];
    //     // console.log('HAS FILE');
    //     // req.body.images = [req.files.avatar.path];
    // }


    const response = await ServiceProvider.findByIdAndUpdate(spid, req.body, {new: true})

    console.log(response);

    return res.status(200).json({
        success: response ? true : false,
        updatedServiceProvider: response ? response : "Cannot update a Service Provider",
        mes: response ? 'Success Updated' : 'Failed to Update'
    });
})

const updateServiceProvider = asyncHandler(async(req, res)=>{
    const spid = req.params.spid
    console.log('vuivuiuviuv', req.body, spid);
    if(Object.keys(req.body).length === 0){
        throw new Error('Missing input');
    }

    const { ownerFirstName, ownerLastName, ownerEmail, advancedSetting } = req.body;
    // if(!ownerFirstName || !ownerLastName || !ownerEmail){
    //     throw new Error('Missing input');
    // }
    if (advancedSetting?.showStaffDetailBooking) {
        if (advancedSetting.showStaffDetailBooking === 'true') {
            advancedSetting.showStaffDetailBooking = true;
        }
        else {
            advancedSetting.showStaffDetailBooking = false;
        }
    }

    // console.log('files: ', req.files);
    if(req.file){
        console.log('file: ', req.file);
        req.body.images = [req.file.path];
        // console.log('HAS FILE');
        // req.body.images = [req.files.avatar.path];
    }

    if (req.body.mobile) {
        const uresp = await User.updateOne({ provider_id: spid },
            { $set: {
                mobile: req.body.mobile,
                firstName: ownerFirstName,
                lastName: ownerLastName,
                email: ownerEmail,
        }});
        console.log(uresp);

        if (!uresp) {
            throw new Error('Cannot update corresponding id.');
        }
    }

    const response = await ServiceProvider.findByIdAndUpdate(spid, req.body, {new: true})
    // console.log(response);
    if (response) {
        const esResult = await ESReplicator.updateProvider(spid, req.body);
        if (!esResult.success || !esResult.data) {
            await Service.findByIdAndUpdate(response._id, { synced: false });
            // throw new Error('Canceled update for unresponsed Elastic Connection');
    
            return res.status(200).json({
                success: true,
                mes: 'Created successfully but temporairily unavailable to search, contact support'
            });
        }
    
    }


    return res.status(200).json({
        success: response ? true : false,
        updatedServiceProvider: response ? response : "Cannot update a Service Provider",
        mes: response ? 'Success Updated' : 'Failed to Update'
    });
})

const getServiceProvider = asyncHandler(async(req, res)=>{
    const spid = req.params.spid;
    const sp = await ServiceProvider.findById(spid);

    const owner = await User.find({provider_id: spid});
    sp.owner = owner;

    return res.status(200).json({
        success: sp ? true : false,
        payload: sp ? sp : "Cannot find Service Provider"
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

const addServiceProviderQuestion = asyncHandler(async(req, res)=>{
    const {qna, provider_id} = req.body;
    if(!qna && !provider_id){
        throw new Error('Missing input')
    }
    // console.log('--{{{{{{{{{{{{}}}}}}}}}}}}>'+JSON.stringify(req.body));

    const response = await ServiceProvider.findByIdAndUpdate(provider_id, {chatGivenQuestions:qna}, {new:true});
    // console.log('--{{{{{{{{{{{{}}0000000000000>'+response);
    return res.status(200).json({
        success: response ? true : false,
        qna: response ? response : "Cannot modify service provider"
    })
})

const getServiceProviderByOwnerId = asyncHandler(async(req, res)=>{
    const {owner} = req.body;
    if(!owner){
        throw new Error('Missing input')
    }
    // console.log(req.body);
    const response = await User.findById(owner).populate('provider_id');
    return res.status(200).json({
        success: response ? true : false,
        provider: response?.provider_id?._id ? response.provider_id : "Cannot get service provider"
    })
})

const updateServiceProviderTheme = asyncHandler(async(req, res)=>{
    const spid = req.params.spid

    const {theme} = req.body
    if(!theme){
        throw new Error('Missing inputttt')
    }``

    const response = await ServiceProvider.findByIdAndUpdate(spid,  { $set: { theme } }, {new: true})

    if (!response) {
        return res.status(404).json({
            success: false,
            message: "Service Provider not found",
        });
    }

    return res.status(200).json({
        success: response ? true : false,
        updatedServiceProvider: response ? response : "Cannot update a Service Provider",
        mes: response ? 'Settings has been saved' : 'Failed to Update'
    })
})

const getServiceProviderByAdmin = asyncHandler(async(req,res) => {
    const {_id} = req.user
    const {provider_id} = await User.findById({_id}).select('provider_id')
    const sp = await ServiceProvider.findById(provider_id);
    return res.status(200).json({
        success: sp ? true : false,
        payload: sp ? sp : "Cannot find Service Provider"
    })
})

const updateFooterSection = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {provider_id} = await User.findById({_id}).select('provider_id');
    console.log(req?.body);
    const sp = await ServiceProvider.findById(provider_id);
    
    // Update the footer section with the new data from req.body
    if (sp) {
        // Update indexFooter
        sp.indexFooter = req.body.formattedData.map(item => ({
            field: item.field,
            order: item.order,
            column: item.column,
            isVisible: item.isVisible
        }));

        // Update slogan
        sp.slogan = req.body.slogan;

        // Update socialMedia
        sp.socialMedia = {
            facebook: req.body.socialLinks.find(link => link.platform === 'facebook')?.url || '',
            instagram: req.body.socialLinks.find(link => link.platform === 'instagram')?.url || '',
            linkedin: req.body.socialLinks.find(link => link.platform === 'linkedin')?.url || '',
            youtube: req.body.socialLinks.find(link => link.platform === 'youtube')?.url || '',
            twitter: req.body.socialLinks.find(link => link.platform === 'twitter')?.url || '',
            tiktok: req.body.socialLinks.find(link => link.platform === 'tiktok')?.url || ''
        };

        // Update logoSize
        sp.logoSize = req.body.logoSize;

        const updatedProvider = await sp.save(); // Save the updated document

        return res.status(200).json({
            success: true,
            updatedServiceProvider: updatedProvider,
            mes: 'Footer section updated successfully'
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "Service Provider not found",
        });
    }
});




const searchSPAdvanced = asyncHandler(async (req, res) => {
    console.log("INCOMING REQUESTS:", req.body);

    let { searchTerm, limit, offset, categories, sortBy,
        clientLat, clientLon, distanceText } = req.body;

    if ( (typeof(offset) != "number") ||
        !limit || offset < 0 || limit > 20)
    {
        console.log(offset, typeof offset);
        console.log(limit, typeof limit);
        return res.status(400).json({
            success: false,
            searched: [],
            msg: "Bad Request"
        });
    }

    let sortOption = [];
    let geoSortOption = null;
    // if (sortBy?.indexOf("-price") > -1) {
    //     sortOption.push({price : {order : "desc"}});
    // }
    // else if (sortBy?.indexOf("price") > -1) {
    //     sortOption.push({price : {order : "asc"}});
    // }

    if (sortBy?.indexOf("createdAt") > -1) {
        sortOption.push({createdAt : {order : "desc"}});
    }
    if (sortBy?.indexOf("location") > -1) { geoSortOption = { unit: "km", order: "asc" }; }

    // let categoriesIncluded = [];
    // if (categories?.length) {
    //     categoriesIncluded = categories;
    // }

    let geoLocationQueryOption = null;
    if ( clientLat <= 180.0 && clientLon <= 180.0 &&
        clientLat >= -90.0 && clientLon >= -90.0 )
    {
        geoLocationQueryOption = { clientLat, clientLon };
    }
    if (/[1-9][0-9]*(km|m)/.test(distanceText)) {
        geoLocationQueryOption = { ...geoLocationQueryOption, distanceText };
    }

    const columnNamesToMatch = ["bussinessName", "province","address"];
    const columnNamesToGet = ["id", "address", "province", "images", "bussinessName", "mobile", "createdAt  "];

    let services = [];

    // console.log("____________________________________>>>>>", sortOption,
    //     geoLocationQueryOption,
    //     geoSortOption);

    services = await esDBModule.fullTextSearchAdvanced(
        ES_CONSTANT.PROVIDERS,
        searchTerm,
        columnNamesToMatch,
        columnNamesToGet,
        limit,
        offset,
        sortOption,
        geoLocationQueryOption,
        geoSortOption,
        null,
        null,
        null,
        false
    );
    services = services?.hits;

    console.log("Query Input Parameter: ", services);
    console.log("REAL DATA RETURNED: ", services);

    return res.status(200).json({
        success: services ? true : false,
        providers: services
    });
});




module.exports = {
    createServiceProvider,
    getAllServiceProvider,
    updateServiceProvider,
    deleteServiceProvider,
    getServiceProvider,
    addServiceProviderQuestion,
    getServiceProviderByOwnerId,
    updateServiceProviderTheme,
    finalRegisterProvider,
    getServiceProviderByAdmin,
    updateFooterSection,
    searchSPAdvanced
}