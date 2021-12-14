const express = require('express')
const bodyParser= require('body-parser')
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors= require('cors')
const app = express();  
const db = require('./config/db/connectmongose.js');
db.connect();
var corsOptions = {
    origin: 'https://mern-dieu-fe.herokuapp.com',
    optionsSuccessStatus: 200 
  }
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()); 
app.use(express.static('upload'));
const PORT = process.env.PORT||4000;
const router= require('./router/index');
app.use('/api',router);

var os = require("os")
app.get("/test",(req,res)=>{
  
  var ipt = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;
  var ip =ipt.split(':').pop();
  console.log(ip)
  console.log(	os.hostname())
  console.log(	os.type()+ os.arch())

  res.end()
})
app.listen(PORT, () => console.log('Server started on port: '+PORT));