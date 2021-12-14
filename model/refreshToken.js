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
module.exports =mongoose.model('tokenRefresh', schemauser);
// quản lý các phiên đã làm việc
// lưu lại lịch sử truy cập của các lần login
// thực ra có thể lưu lại các hành động truy cập của các lần truy cập