const modeluser = require('../model/user');

const topup=(req,res)=>{
    modeluser.findOne({username: req.user.username},"price",(err,docs)=>{
        if(docs){
            modeluser.updateOne({
                username: req.user.username
            },{
                $set:{price:docs.price+ Number(req.body.money)}
            },(err)=>{
                if(err) res.json({msg:"lỗi nạp tiền"})
                else res.json({msg: "nạp tiền thành công"})
            })
        }
    })
}
const withdraw=(req,res)=>{
    modeluser.findOne({username: req.user.username},"price",(err,docs)=>{
        if(docs.price>Number(req.body.money)){
            modeluser.updateOne({
                username: req.user.username
            },{
                $set:{price:docs.price- Number(req.body.money)}
            },(err)=>{
                if(err) res.json({msg:"lỗi nạp tiền"})
                else res.json({msg: "rút tiền thành công"})
            })
        }
        else{
            res.json({msg:"tham lam , rút nhiều hơn có "})
            res.end()
        }
        
})
}
module.exports={
    topup,
    withdraw
}