const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy=require('passport-google-oauth20')
const FacebookStrategy=require('passport-facebook');
const keys=require('../config/keys')
const Models=require("../models/models")
const User=Models.userModel;
const transporter=require('./nodemailer-setup');

passport.serializeUser((user,done)=>{
    console.log('serialize---------------------------------------------------------------------')
    done(null,user.id)
});

passport.deserializeUser((id,done)=>{
    console.log('deserialize+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    User.findById(id,(err,user)=>{
        done(err,user);
    })
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false
    },(req,email, password, done) =>{
    User.findOne({email:email})
        .then((user)=>{
            if(!user || user.password!==password){
                return done(null,false)
            }
            return done(null,user);
        })
        .catch(err=>{
            console.log("Error in USER FINDING :"+err)
            return done(null,false);
        })
}));

passport.use(
    new GoogleStrategy({
        callbackURL:keys.google.redirect,
        clientID:keys.google.clientId,
        clientSecret:keys.google.clientSecret
    },(accessToken,refreshToken,profile,done)=>{
        console.info("callback passport-facebook fired",profile);
        User.findOne({email: profile.emails[0].value})
            .then((existingUser)=>{
                if (existingUser){
                    done(null,existingUser);
                }
                else{
                    //creating new user object to insert into DB
                    new User({
                        displayName:profile.displayName,
                        googleId: profile.id,
                        photoURL:profile.photos[0].value,
                        email:profile.emails[0].value
                    }).save().then((newUser)=>{
                        console.log("new user created :"+newUser);
                        done(null,newUser)
                    }).catch(err=>{
                        console.log("error occurred",err);
                    })
                }
            })
            .catch(err=>{
                console.log("error in user findOne",err)
            })
    })
);

passport.use(
    new FacebookStrategy({
        callbackURL:keys.facebook.redirect,
        clientID:keys.facebook.clientId,
        clientSecret:keys.facebook.clientSecret,
        enableProof: true,
        graphApiVersion: 'v6.0',
        profileFields: ['id', 'displayName','email','picture.type(large)']
    },(accessToken,refreshToken,profile,done)=>{
        console.info("callback passport fired",profile)
        const {displayName,id,photos,emails}=profile;
        User.findOne({email: emails[0].value})
            .then((existingUser)=>{
                if (existingUser){
                    done(null,existingUser);
                }
                else{
                    //creating new user object to insert 3into DB
                    new User({
                        displayName,
                        googleId: id,
                        photoURL:photos[0].value,
                        email:emails[0].value
                    }).save().then((newUser)=>{
                        console.log("new user created :"+newUser);
                        done(null,newUser)
                    }).catch(err=>{
                        console.log("error occurred",err);
                    })
                }
            })
            .catch(err=>{
                console.log("error in user findOne",err)
            })
    })
);