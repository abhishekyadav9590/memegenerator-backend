var express = require('express');
var router = express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
const otpGenerator=require('otp-generator')
const keys=require('../config/keys');
const Models=require("../models/models")
const User=Models.userModel;
const transporter=require('../services/nodemailer-setup');

router.post('otpVerify',(req,res,next)=>{
    User.findOne({email,})
});
router.post('/register',(req,res,next)=> {
    const {email,password}=req.body;
    let otp=otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false});
    let message={
        from:"Meme Generator <abhishek.yadav@tothenew.com>",
        to:email,
        subject:"OTP for Account Activation",
        html:"Hi ! <br/> OTP for account activation is :"+otp
    };

    User.findOne({email})
        .limit(1)
        .then(existingUser=>{
            console.log("existing user data:",existingUser);
            console.log("--------------------------------------------------------");
            if(existingUser){
                    transporter.sendMail(message)
                        .then(response=>{
                            console.log(response);
                            existingUser.otp=otp;
                            existingUser.password=password;
                            existingUser.save().then(otpUpdatedintoUser=>{
                                console.log("inserting otp in DB",otpUpdatedintoUser);
                                res.status(200).send({redirect:"otp"})
                            }).catch(err=>{
                                console.log("error in inserting otp in DB",err);
                                res.sendStatus(500);
                            })
                        })
                        .catch(err=>{
                            console.log("Error in sending otp to email",err);
                            res.sendStatus(500)
                        })
            }
            else if (existingUser===null){

                //sending opt before insertion in DB
                transporter.sendMail(message)
                    .then(info=>{
                        console.log("Message Sent :%s",info.messageId,info);
                        //creating new user
                        new User({
                            email,
                            password,
                            otp,
                        }).save().then((newUser)=>{
                            console.log("new user created :"+newUser);
                            res.status(200).send({
                                redirect:"otp"
                            })
                        }).catch(err=>{
                            console.log("error occurred",err);
                        })
                    })
                    .catch(err=>{
                        console.log("Error occurred. "+err.message);
                        return process.exit(1);
                    })
            }
        })
        .catch(ErrorInFindOne=>{
            console.log("Error is : ",ErrorInFindOne)
            res.sendStatus(500)
        })
})

router.post('/login',passport.authenticate('local', { failureRedirect: '/login' }),(req,res,next)=>{
    console.log(req.body);
    const token=jwt.sign({
        data:req.user._id
    },keys.jwt.secret)
    console.info('user from request is :',req.user);
    res.status(200).send({"token":token});
})

router.get("/google",passport.authenticate("google",{
    scope:['profile','email'],
    accessType:'offline'
}))

router.get("/google/redirect",passport.authenticate("google", {failureRedirect: '/google' }),(req,res)=>{
    const token=jwt.sign({
        data:req.user._id
    },keys.jwt.secret)
    console.info('user from request is :',req.user);
    res.redirect("http://localhost:3001/token?q="+token);
})

router.get("/facebook",passport.authenticate("facebook",{
    scope: ['user_friends', 'manage_pages','email'],
    accessType:'offline'
}))

router.get("/facebook/redirect",passport.authenticate("facebook", {failureRedirect: '/facebook' }),(req,res)=>{
    const token=jwt.sign({
        data:req.user._id
    },keys.jwt.secret)
    console.info('user from request is :',req.user);
    res.redirect("http://localhost:3001/token?q="+token);
})

// router.get("/instagram",passport.authenticate("instagram",{
//     scope: ['user_friends', 'manage_pages'],
//     accessType:'offline'
// }))
//
// router.get("/instgram/redirect",passport.authenticate("instagram", {failureRedirect: '/instagram' }),(req,res)=>{
//     const token=jwt.sign({
//         data:req.user._id
//     },keys.jwt.secret)
//     console.info('user from request is :',req.user);
//     res.redirect("http://localhost:3001/token?q="+token);
// })


module.exports = router;