
const dotenv = require('dotenv').config();
const fs = require('fs-extra');
const modelbook= require('../model/books');
const modeluser= require('../model/user')
const {usecollection} = require('../model/createcollection');
const {createbook}= require('../model/createcollection');
const { deleteFileS3 } = require('../multer/deleteFileS3');

const writebook=(req,res)=>{
 
    let datareq= {
        idbook:req.body.idbook,
        namebook:req.body.namebook,
        urlimg: "book/"+req.file.originalname,
        pricebook:Number(req.body.pricebook),
        status:false,
        chapternumber:0,
        chaptertotal:Number(req.body.chaptertotal),
        description:req.body.description,
    }
    //nhận tên sách, ảnh sách, giá sách, tổng số chương sách , mô tả
    //
    //lưu thông tin khởi tạo của sách 
    let addbook = new modelbook(datareq);
    addbook.save((err)=>{
        if(err){
            res.json({msg:"lưu thất bại"})
        }
        else{
            //res.json({msg:"lưu thành công"})
            res.json({result:"ok"})
            res.end()
        }
    })
    //cập nhật bookforsale : để bán sách của người dùng
    modeluser.findOne({username:req.user.username},"bookforsale", function (err, docs) {
        if (docs) {
            docs.bookforsale.push(req.body.idbook); 
            
            modeluser.updateOne({
                username: req.user.username
            }, { 
                $push: {bookforsale:req.body.idbook }
            }, (err) => {
                if (err) res.send(err);
                else res.end();
            })
        }
    });
    // tạo collection sách đó
    if(createbook(req.body.idbook)){
        // sau khi tạo xong collection thì làm gì sau đó ...
        res.json({result:"ok"})
        res.end();
    }
}

const updatebook= async (req,res)=>{
        modelbook.findOne({idbook: req.params.idbook}, async function (err, docs){
            if(docs){
                try{
                    let [path,key] =docs.urlimg.split("/") // do lỗi path có chứa  \
                    
                    await deleteFileS3(path,key)
                }
                catch(err){
    
                }
                let datareq={
                    namebook: req.body.namebook,
                    urlimg: "book/"+req.file.originalname,
                    pricebook:req.body.pricebook,
                    chaptertotal:req.body.chaptertotal,
                    description:req.body.description,
                }
               
                modelbook.updateOne({
                    idbook: req.params.idbook
                }, {
                    $set: datareq
                }, (err) => {
                    if (err) res.send(err);
                    else res.end();
                })
            }else{
                res.json({msg: "sách không tồn tại"})
            }
        })
        
    
}

const getdataonebook=(req,res)=>{
    let username=req.user.username;
    modelbook.findOne({idbook: req.params.idbook}, function (err, docs){
        if(docs){
            modeluser.findOne({username:username},"bookforsale", function (err, doc) {
                if (doc) {
                    let listbookresult = doc.bookforsale.filter(e=> e==req.params.idbook);
                    if(listbookresult.length>0){
                    
                        docs.status=true
                        res.json(docs);
                    res.end() 
                    } else {
                        
                        docs.status=false
                        res.json(docs);
                        res.end() 
                    };
                    
                }
                else {
                    
                    res.json("đừng hack trang em");
                    res.end()
                }
            });
        }else{
            res.end()
        }
        
   })
    
}

const getlistbook=(req,res)=>{
    // default 1 page =15 
    let limit =14   
    let skip = (Number(req.params.page)-1) * limit
    const query = req.query.search||""
    //console.log(FormatVi(query))
    modelbook.find({namebook:{'$regex':query,'$options': 'i'}},"idbook namebook urlimg pricebook status chapternumber chaptertotal", function (err, docs) {
       if(docs){
          modelbook.countDocuments({namebook:{'$regex':query,'$options': 'i'}},(err,count)=>{
              const datares={
                pagination:{
                 limit:limit,
                 totalDocument:count,  
                },
                arrayDocument:docs
            }
            res.json(datares);
            res.end();
          })
           
       }
       else{
           res.json({msg:"lỗi lấy dữ liệu"})
       }
    }).skip(skip).limit(limit)
}
const buybook=(req,res)=>{
    modeluser.findOne({username: req.user.username},"price purchasedbook bookforsale",(err,docuser)=>{
        let filterbookforsale = docuser.bookforsale.filter(e=> e==req.params.idbook);
        let filterpurchasedbook = docuser.purchasedbook.filter(e=> e==req.params.idbook);
        if(filterbookforsale.length>0 | filterpurchasedbook.length>0){
            // có nghĩa sách này đã mua rồi hoặc chính người bán thì không cần phải mua nữa
            res.json({msg:"sách này đã có"})
            res.end();
        }else{
            modelbook.findOne({idbook:req.params.idbook},"pricebook", function (err, docbook) {
                //lấy tiền của user đó trừ đi tiền sách 
                // cập nhật lại purchasedbook
                if(docuser.price-docbook.pricebook>=0){
                    docuser.purchasedbook.push(req.params.idbook)
                    
                    let dataupdate={
                        price:docuser.price-docbook.pricebook,
                        purchasedbook:docuser.purchasedbook
                    }
                    modeluser.updateOne({
                        username: req.user.username
                    },{
                        $set:dataupdate
                    },(err)=>{
                        if(err) res.json({msg:"lỗi mua sách"})
                        else res.json({msg: "mua sách thành công", result: true})
                    })
            
                modeluser.findOne({bookforsale: req.params.idbook},"username price",(err,doc)=>{
                 
                    modeluser.updateOne({
                        username: doc.username
                    },{
                        $set:{ price:doc.price+docbook.pricebook }
                    },(err)=>{
                        if(err) console.log(err)
                    })
                })
                }else{
                    res.json({msg:"không đủ tiền mua sách",result: false})
                }
                
            })
        }
        
       
    })
}
const CheckUserRequestReadbook=(req,res)=>{
    res.json({result:true});
    res.end()
}
const getlistchapter=(req,res)=>{
    let modelgetbook=usecollection(req.params.idbook) 
    modelgetbook.find({},"-_id chapternumber chaptername", (err, docs)=>{
        if(docs){
            res.json(docs);
            res.end();
        }else{
            res.json({msg:"đừng hack đến đây vui nhỉ :v"});
            res.end();
        }
    })
}
const getNamebookForId=(req,res)=>{
    modelbook.findOne({idbook:req.params.idbook},"namebook", (err,docs)=>{
        if(docs){
            res.json(docs)
        }else{
            res.json({msg:"Mã sách không tồn tại"})
        }
    })
}
const testupdate = async(req,res)=>{
    await deleteFileS3(null, '1.jpg')
    res.end()
}
module.exports={
    writebook,
    getdataonebook,
    updatebook,
    getlistbook,
    buybook,
    CheckUserRequestReadbook,
    getlistchapter,
    getNamebookForId,
    testupdate
}
