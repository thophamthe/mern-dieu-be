// file này check các quyền của user 
// cũng tính làm này bên middelware nhưng thôi tách ra :)

const modeluser= require('../model/user');

//check quyền upload sách đó. có quyền này mới có thể thêm, sửa chapter cho sách
const checkbookforsale=async (req,res,next)=>{
    modeluser.findOne({username:req.user.username},"bookforsale", await function (err, docs) {
        if (docs) {
            let listbookresult = docs.bookforsale.filter(e=> e==req.params.idbook);
            if(listbookresult.length>0){
               
               next()
            } else {
                res.json({msg:"xin đừng hack trang em"})
                res.end()
            };
        }
        else res.json({msg:"người dùng không tồn tại"});
    });
}
//check quyền đọc : phải là người bán sách đó hoặc mua sách đó rồi mới có quyền đọc
const checkreadbook=async (req,res,next)=>{

    modeluser.findOne({username:req.user.username},"purchasedbook bookforsale", await function (err, docs) {
        if (docs) {
            let filterbookforsale = docs.bookforsale.filter(e=> e==req.params.idbook);
            let filterpurchasedbook = docs.purchasedbook.filter(e=> e==req.params.idbook);
            if(filterbookforsale.length>0 | filterpurchasedbook.length>0 ){
               next()
            } else {
                res.json({result:false});
                res.end()
            };
        }
        else res.json({msg:"người dùng không tồn tại"});
    });
}
module.exports={
    checkbookforsale,
    checkreadbook
}
