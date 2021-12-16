const modeluser= require('./model/user')

modeluser.findOne({bookforsale: {$elemMatch: "thothe1625394809893"}},"username",(err,doc)=>{
    console.log(doc)
})