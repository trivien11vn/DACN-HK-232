const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var staffSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    mobile:{
        type:String,
        unique:true,
        required:true,  
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service_Provider',
    },
},{
    timestamps: true
});


//Export the model
module.exports = mongoose.model('Staff', staffSchema);