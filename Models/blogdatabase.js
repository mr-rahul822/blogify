const mongoose = require("mongoose")
const { applyTimestamps } = require("./userdatabase")
const { Schema } = mongoose
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    auther:{
        type: String,
        required :true
    },
    date:{
        type: String,
        default: Date.now
    },
    expert:{
        type: String,
        required : true
    },
    content:{
        type: String,
        required : true
    },
    image:{
        type:String,
        default: "📝"
    },
    slug:{
        type:String,
        required: true,
        unique : true 
    },
    published:{
        type: Boolean,
        default : false
    }
}, {timestamps: true})


const USERBLOGS = mongoose.model("blogposts",postSchema)

module.exports = USERBLOGS;