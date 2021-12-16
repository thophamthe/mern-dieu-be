const jwt = require('jsonwebtoken');
const modeluser = require('../model/user');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

const checklogin=async (req,res,next)=>{
    let datareq= req.body;
   
    modeluser.findOne({username: datareq.username},"username password -_id",await function (err, docs) {
       
        if (docs) {
            bcrypt.compare(datareq.password, docs.password, function(err, result) {
               if(result){
                next();
               }else res.end();
            });
        } else {
            res.json({msg:"không tìm thấy người dùng"})
          
        }
    });
}
const authenticatetoken = (req,res,next)=>{
    try {
    const token = req.headers.token;
    const refreshToken = req.headers.refreshToken;
    if(!token)return res.status(400).json({msg:"chưa có jwt"});
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(400).json({msg:"sai jwt"})
        else req.user=user;
        next();
    })
    }
    catch(err){
        res.status(400).json({msg:"jwt bị lỗi"});
        res.end()
        
    }
    
}
module.exports ={
    authenticatetoken,
    checklogin
}