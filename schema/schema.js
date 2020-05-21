const Schema=require("mongoose").Schema;

//creating schemas for USER collection/table
const userSchema=new Schema({
    googleId:String,
    email:String,
    password:String,
    displayName:String,
    photoURL:String,
    isAdmin:{
        type:Boolean,
        default:true,
    },
    isActive:{
        type:Boolean,
        default: true
    },
    requestforAdmin:{
        type:Boolean,
        default:false
    },
    otp:Number,
})
module.exports={
    userSchema
}