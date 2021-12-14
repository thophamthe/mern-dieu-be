const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const schemauser = new Schema({
  username: String,
  refreshToken:String,
  address:String,
  deviceName:String,
  operatingSystem:String,
  datetime:String
});
module.exports =mongoose.model('token', schemauser);