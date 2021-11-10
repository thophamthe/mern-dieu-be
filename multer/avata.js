const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"upload/avata")
    },
    filename : (req,file,cb)=>{  
        cb(null,file.originalname )
    }
})
const upload = multer(
    {
    storage: storage,
    limits : {fileSize : 5000000}
})
module.exports =upload;