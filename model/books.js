const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const schemabook = new Schema({
  idbook: String,
  namebook: String,
  urlimg:String,
  pricebook:Number,
  status:Boolean,
  chapternumber:Number,
  chaptertotal:Number,
  description:String
});
module.exports =mongoose.model('books', schemabook);