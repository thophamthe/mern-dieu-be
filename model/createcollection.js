const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
  chapternumber:Number,
  chaptername:String,
  dateupdated:String,
  content:String
});
//tạo khi thêm mới sách
const createbook = (namecollection)=>{
    const create= mongoose.model(namecollection, schema);
    create.createCollection().then((collection)=>{
        return true
    })
}
const usecollection=(namecollection)=>{
    return mongoose.model(namecollection, schema);
}
module.exports ={
    createbook,
    usecollection
}