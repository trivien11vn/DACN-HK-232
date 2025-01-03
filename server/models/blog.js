const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:Array,
        required:true
    },
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service_Provider',
    },
    tags:{
        type:Array,
        required:true
    },
    numberView:{
        type:Number,
        default:0,
    },
    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes:[
        {
            type:mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    thumb:{
        type: String,
        default: 'https://noithatkendesign.vn/storage/app/media/uploaded-files/san-vuon1.jpg'
    },
    images: [
        {
            type: String
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments:[
        {
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String},
            updatedAt: {type: Date}
        }
    ],
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);