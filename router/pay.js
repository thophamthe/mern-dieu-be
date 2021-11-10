const express = require('express');
const router = express.Router();
const pay= require('../controller/pay')
const middlewareauth = require('../middleware/authenticate');
router.post('/topup',middlewareauth.authenticatetoken,pay.topup);
router.post('/withdraw',middlewareauth.authenticatetoken,pay.withdraw)
module.exports= router;