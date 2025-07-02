const mongoose = require("mongoose")
const { applyTimestamps } = require("./userdatabase")
const USER = require("./userdatabase")
const { Schema } = mongoose
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
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
    },
     views: {
        type: Number,
        default: 0
    },
}, {timestamps: true})

postSchema.pre('save' , function(next){
    if(this.isModified()&& !this.isNew){
        this.updatedAt = Date.now
    }

    next();
})


const USERBLOGS = mongoose.model("blogposts",postSchema)

module.exports = USERBLOGS;