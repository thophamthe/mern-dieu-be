const {usecollection} = require('../model/createcollection');
const date = require('date-and-time');
const modelbook = require('../model/books')
const readchapter=(req,res)=>{
    
    let modelgetbook=usecollection(req.params.idbook) 
    modelgetbook.findOne({chapternumber:req.query.chapter}, (err, docs)=>{
        if(docs){
            res.json(docs);
            res.end();
        }else{
            res.json({msg:"hack đến đây vui nhỉ :v"});
            res.end();
        }
    })
}
const writechapter = (req,res)=>{
    const now = new Date();
    let datetime=date.format(now, 'YYYY/MM/DD HH:mm:ss').toString();

    
    let modelgetbook=usecollection(req.params.idbook) 
    // đoạn này hơi vớ vẩn :)
    // usecollection là một hàm được callback bên model createcollection
    console.log(req.body)
    modelgetbook.findOne({},"chapternumber",(err,docs)=>{
        let number = docs?docs.chapternumber:0
        let newchapter = number+1;
        modelbook.findOne({idbook:req.params.idbook},"chaptertotal",(err,docs)=>{
            
            if(newchapter > docs.chaptertotal){
                res.send({msg:"đã đầy chương sách, nếu bạn muốn thêm hãy cập nhật lại sách"})
                res.end();
            }
            else{
                let datareq = {
                    chapternumber: newchapter,
                    chaptername:req.body.chaptername,
                    dateupdated: datetime,
                    content:req.body.content  
                }
                let addchapter = new modelgetbook(datareq); 
                addchapter.save((err)=>{
                    if(err){
                        res.json({msg:"lưu chap thất bại"})
                        res.end();
                    }
                })
                modelbook.updateOne({
                    idbook: req.params.idbook
                }, {
                    $set: {chapternumber:newchapter}
                }, (err) => {
                    if (err) res.send(err);
                    else {
                        res.json({msg:"lưu chap thành công"})
                        res.end();
                    }
                })
            }
        })

    }).sort({chapternumber:-1})
}
const updatechapter=(req,res)=>{
    const now = new Date();
    let datetime=date.format(now, 'YYYY/MM/DD HH:mm:ss').toString();
    let modelgetbook=usecollection(req.params.idbook) 
    modelgetbook.updateOne({
        chapternumber: req.body.chapter
    }, {
        $set: {
            dateupdated:datetime,
            content:req.body.content,
            chaptername:req.body.chaptername
        }
    }, (err) => {
        if (err) res.send(err);
        else {
            res.json({msg:"lưu chap thành công"})
            res.end();
        }
    })
 
}
const getchapternameforbook=(req,res)=>{ // để load danh sách các chương của sách FE cần
    let modelgetbook=usecollection(req.params.idbook) 
    modelgetbook.find({},"chapternumber chaptername", (err, docs)=>{
        if(docs){
            res.json(docs);
            res.end();
        }else{
            res.json({msg:"đừng hack đến đây vui nhỉ :v"});
            res.end();
        }
    })
}
module.exports={
    writechapter,
    getchapternameforbook,
    readchapter,
    updatechapter
}