const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true,

    },
    phone:{
        type:Number,
        required: true,
        unique:true
    },
    gender:{
        type:String,
        enum: ["Male", "Female"],
        require:true
        
    },
    userType:{
        type:String,
        enum:["Admin", "Regular"],
       default: "Regular"
    },
    address:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    adminId:{
        type:String
    },
    memberId:{
        type:Number,

    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


module.exports = mongoose.model("user", userSchema)