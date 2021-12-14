const jwt = require('jsonwebtoken');
const modeluser = require('../model/user');
const modelrefreshToken= require('../model/refreshToken')
const dotenv = require('dotenv').config();
var os = require("os")
const date = require('date-and-time');

const login=async (req,res)=>{
    let token = generateAccessJWT({username: req.body.username});
    let refreshToken = generateRefreshJWT({username: req.body.username})

   await modeluser.findOne({username:req.body.username},"-password -purchasedbook -bookforsale",function (err, docuser) {
        let datares={
            token: token,
            refreshtoken: refreshToken,
            user:docuser
        }
        let ipt = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
        let ip =ipt.split(':').pop();
        const now = new Date();
        let datetime=date.format(now, 'YYYY/MM/DD HH:mm:ss').toString();
        let datareq = {
            username: req.body.username,
            datetime:datetime,
            refreshToken:refreshToken,
            address:ip,
            deviceName:os.hostname(),
            operatingSystem:os.type()+ os.arch()
        }
        let refresh=  new modelrefreshToken(datareq);
        refresh.save((err)=>{
            if (err) {
                console.log(err)
               
            }
            else{
               
            }
        })
 
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
const generateAccessJWT = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:"10m"});
}
const generateRefreshJWT = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}
module.exports={
    login,
    logout,
    loginWtoken
}