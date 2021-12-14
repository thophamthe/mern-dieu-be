const modeluser = require('../model/user');
const modelbook= require('../model/books');
const dotenv = require('dotenv').config();
const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const getdatauser= (req,res)=>{
    modeluser.findOne({username:req.user.username},async function (err, docuser) {
        if(docuser){
            let arrbookforsale= docuser.bookforsale;
            let arrpurchasedbook= docuser.purchasedbook;
            let datares={
                bookforsale:null,
                purchasedbook:null
            }
            
            modelbook.find({idbook:arrpurchasedbook},await  function (err, doc) {
               datares.purchasedbook=doc
            modelbook.find({idbook:arrbookforsale}, function (err, docs) {
            datares.bookforsale=docs
            res.json(datares)
            res.end()
            });
                
            }); 
            
           
        }
        else {
            return null
        }
    })
    
}   
const newuser=(req,res)=>{

    modeluser.findOne({username: req.body.username},"username", function (err, docs) {
     
        if (!docs) {
            let datareq = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password,parseInt(process.env.SALTROUNDS)),
                fullname: req.body.fullname,
                urlimg:req.file.path.slice(7),
                phonenumber: req.body.phonenumber,
                gmail: req.body.gmail,
                from : req.body.from,
                purcharsedbook: [],
                bookforsale: [],
                status: "online",
                price : 0,
                refreshToken:null
            }
            let adduser=  new modeluser(datareq);
            adduser.save((err)=>{
                if (err) {
                    console.log(err)
                    res.json({ success:false,msg:"lưu thất bại"})
                }
                else{
                    res.json({ success:true,msg:"lưu thành công, Đăng nhập để tiếp tục"})
                }
            })
        } else res.json({
            success:false,
            msg: "username đã tồn tại",
        })
    });
}
const updateuser=(req,res)=>{
    modeluser.findOne({username: req.user.username}, function (err, docs) {
        if (docs) {
            try{
                if(docs.urlimg!=null){
                    let link = "upload/" + docs.urlimg;
                    fs.remove(link)
                    .then(() => {
                        
                    })
                    .catch(err => {
                    console.error(err)
                    })
                }   
            }
            catch(err){

            }
            let datareq = {

                fullname: req.body.fullname,
                urlimg:req.file.path.slice(7),
                phonenumber: req.body.phonenumber,
                gmail: req.body.gmail,
                from : req.body.from,
            }
            console.log(req.file.path.slice(7))
            modeluser.updateOne({
                username: req.user.username
            }, {
                $set: datareq
            }, (err) => {
                if (err)  res.end();
                else res.end();
            })
        } else res.json({
           msg: "Xin đừng hack của em"
        })
    });
}
module.exports={
    newuser,
    updateuser,
    getdatauser
}