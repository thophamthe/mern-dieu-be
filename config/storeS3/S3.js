

const S3 = require('aws-sdk/clients/s3');
const dotenv = require('dotenv');
dotenv.config();

const bucketname =  process.env.AWS_BUCKET_NAME
const region =process.env.AWS_BUCKET_REGION
const accesskeyID=process.env.AWS_ACCESS_KEY
const secretkey= process.env.AWS_SECRET_KEY

const s3 = new S3 ({
    accessKeyId:  accesskeyID,      // should be:  process.env.AWS_ACCESS_ID
    secretAccessKey:secretkey, 
    region:region
})
module.exports ={s3}