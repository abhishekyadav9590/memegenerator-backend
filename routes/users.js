var express = require('express');
var router = express.Router();
const verifyToken = require('../services/jwtVerify');
const Models=require('../models/models')
const User=Models.userModel;
/* GET users listing. */
router.get('/', verifyToken,(req, res, next) =>{
  let _id=req.body.user;
  User.findById(_id)
      .then(data=>{
        res.status(200).send(data);
      })
      .catch(err=>{
        res.sendStatus(500);
      })

});

module.exports = router;
