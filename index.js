const express = require('express')
const bodyParser= require('body-parser')
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const { blockip, countIp } = require('./middleware/managerIP.js');
const cors= require('cors')
const app = express();  
const db = require('./config/db/connectmongose.js');
db.connect();
var corsOptions = {
    origin: ['https://main.dhgaddof2fot4.amplifyapp.com','https://mern-dieu-fe-production.up.railway.app'],
   optionsSuccessStatus: 200 
  }
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()); 
app.use(express.static('upload'));
const PORT = process.env.PORT||4000;
const router= require('./router/index');

app.use(blockip,countIp)
app.use('/api',router);
app.use("/test",(req,res)=>{
  console.log("success")
  res.end()
})

app.listen(PORT, () => console.log('Server started on port: '+PORT));

