const express = require('express');
const router = express.Router();
const upload= require('../multer/avata')
const user = require('../controller/user')
const middlewareauth = require('../middleware/authenticate');

router.post('/newuser',upload.single("urlimg"),user.newuser)
router.post('/updateuser',middlewareauth.authenticatetoken,upload.single("urlimg"),user.updateuser)
router.get('/getdatauser',middlewareauth.authenticatetoken,user.getdatauser)
module.exports= router;