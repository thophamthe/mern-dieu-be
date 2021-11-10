const jwt = require('jsonwebtoken');
const modeluser = require('../model/user');

const dotenv = require('dotenv').config();

const login=async (req,res)=>{
    let token = generateJWT({username: req.body.username});
    modeluser.findOne({username:req.body.username},"-password -purchasedbook -bookforsale",function (err, docuser) {
        let datares={
            token: token,
            user:docuser
        }
       res.json(datares)
       res.end()
    })
}
const loginWtoken=(req,res)=>{
    modeluser.findOne({username:req.user.username},"-password -purchasedbook -bookforsale",function (err, docuser) {
       res.json(docuser)
       res.end()
    })
}
const logout=(req,res)=>{
    res.clearCookie('token');
    res.end();
}
const generateJWT = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}
module.exports={
    login,
    logout,
    loginWtoken
}