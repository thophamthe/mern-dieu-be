const multer = require('multer');
var multerS3 = require('multer-s3')
const {s3}= require('../config/storeS3/S3')
const bucketname =  process.env.AWS_BUCKET_NAME

const storage = multerS3({
    s3: s3,
    bucket: bucketname+"/avatar",
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer(
    {
    storage: storage,
    limits : {fileSize : 5000000} 
})
module.exports =upload;