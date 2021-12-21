
const {s3}= require('../config/storeS3/S3')
const bucketname =  process.env.AWS_BUCKET_NAME

const deleteFileS3 = (path,key)=>{
    
    const params= {  Bucket: bucketname+"/"+path, Key: key };
s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  // error              // deleted
  });
}


  module.exports = {
      deleteFileS3
  }