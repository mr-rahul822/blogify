const mongoose = require("mongoose")
const { Schema, model} = mongoose
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")


const userschema = new Schema({
    fullname :{
        type : String,
        required : true,
        minLength: 3,
        maxLength: 20   
    },
    email :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase :true
    },
    password :{
        type : String,
        required :true
    },
    salt:{
        type : String,
        requird :true
    },
    profile:{
        type : String,
        default : "/images/default.png"
    },
    role :{
        type: String,
        enum :["USER","ADMIN"],
        default:"USER"
    }

} ,{timestamps: true})


// JWT gtoken genrate method

userschema.methods.getJWT = function(){
    const genrate_token  = JWT.sign({id:this._id,email:this.email},process.env.ENC_SECRET_KEY ,{expiresIn: "1h"});
    return genrate_token;
}




userschema.pre("save", async function (next){

    const userdatabase = this;

    if(!userdatabase.isModified("password")) return (next);

    try{
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(userdatabase.password,salt)

    userdatabase.salt = salt;

    userdatabase.password = hashedPassword
    
    next();
    }catch(err){
    next(err)
    }

})


userschema.methods.comparepass = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const USER = mongoose.model("blogify_user",userschema)


module.exports = USER;