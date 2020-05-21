const {userSchema}=require("../schema/schema")
const mongoose=require('mongoose')

const userModel=mongoose.model('users',userSchema);

module.exports={
    userModel
}