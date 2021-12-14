const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const schemauser = new Schema({
  username: String,
  refreshToken:String,
});
module.exports =mongoose.model('tokenCurrent', schemauser);
// các refresh token hiện đang hoạt động