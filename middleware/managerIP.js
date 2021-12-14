const { count } = require("../model/user");

const countIp=(req,res,next)=>{
  
    let arrIP = new Array(4);
    next()
}
const blockip=(req,res,next)=>{
        
        if(!req.ip){
            res.json("do bạn đã thực hiện req quá nhanh nên chúng tôi chặn bạn")
            res.end()
        }else{
            next()
        }
        
}
module.exports={
    blockip,
    countIp
}