const jwt = require('jsonwebtoken');
const modeluser = require('../model/user');
const modelrefreshToken= require('../model/refreshToken')
const modelcurrentToken = require('../model/tokenCurrent')
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

        // vì mỗi lần login thì sẽ sinh ra 1 refresh token mới . lưu lại các phiên
        // token này sau logut thì k có quyền đòi access token nữa
        let ipt = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
        let ip =ipt.split(':').pop();
        const now = new Date();
        let datetime=date.format(now, 'YYYY/MM/DD HH:mm:ss').toString();
        let datareqAdd = {
            username: req.body.username,
            datetime:datetime,
            refreshToken:refreshToken,
            address:ip,
            deviceName:os.hostname(),
            operatingSystem:os.type()+ os.arch()
        }
        let refresh=  new modelrefreshToken(datareqAdd);
        refresh.save((err)=>{
            if (err) {
                console.log(err)
               
            }
            else{
               
            }
        })

            //thêm vao token hiện hoạt động
            // chức năng đăng xuất tất cả chỉ cần xóa hết token có tên là ... 
        const dataAddCurrenToken ={
            username: req.body.username,
            refreshToken: refreshToken
        }
        let resultAddtokenCurrent= new modelcurrentToken(dataAddCurrenToken)
        resultAddtokenCurrent.save()
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

const newtoken=(req,res)=>{
    let refreshTokenreq = req.headers.refreshtoken;
    modelcurrentToken.findOneAndDelete({refreshToken :refreshTokenreq},(err,doc)=>{
        if(err){
            res.end()

        }else{
           
            if(doc){
                let newrefreshtoken =generateRefreshJWT({username: req.user.username})
                let datatokenres={
                    token:generateAccessJWT({username: req.user.username}),
                    refreshtoken: newrefreshtoken
                }
                const dataAddCurrenToken ={
                 username: req.user.username,
                 refreshToken: newrefreshtoken
             }
             let resultAddtokenCurrent= new modelcurrentToken(dataAddCurrenToken)
             resultAddtokenCurrent.save()
                res.json(datatokenres)
                 res.end()
            }else{
                res.end()
            }
           
        }
    })
}
const logout=(req,res)=>{

    let refreshTokenreq = req.headers.refreshtoken;
    modelcurrentToken.findOneAndDelete({refreshToken :refreshTokenreq},(err,doc)=>{
        if(err){
            res.end()

        }else{
           
            res.end()
        }
    })
}


const generateAccessJWT = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:"3m"});
}
const generateRefreshJWT = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}
module.exports={
    login,
    logout,
    loginWtoken,
    newtoken
}