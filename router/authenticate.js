const express = require('express');
const router = express.Router();

const auth = require('../controller/authenticate.js')
const middlewareauth = require('../middleware/authenticate');


router.post('/login',middlewareauth.checklogin,auth.login)
router.get('/loginWtoken',middlewareauth.authenticatetoken,auth.loginWtoken)
router.get('/logout', middlewareauth.checklogin, auth.logout)
module.exports= router;