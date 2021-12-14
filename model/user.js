const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const schemauser = new Schema({
  username: String,
  password: String,
  refreshToken:String,
  fullname: String,
  urlimg:String,
  gmail:String,
  phonenumber:String,
  from:String,
  purchasedbook:Array,
  bookforsale:Array,
  status: String,
  price:Number
});
module.exports =mongoose.model('user', schemauser);