const express = require('express');
const router = express.Router();

const chapter= require('../controller/chapter');
const middlewareauth = require('../middleware/authenticate');
const validate = require('../validate/book')


router.post('/write/:idbook',middlewareauth.authenticatetoken,validate.checkbookforsale,chapter.writechapter)
router.post('/update/:idbook',middlewareauth.authenticatetoken,validate.checkbookforsale,chapter.updatechapter)
router.get('/getchaptername/:idbook',middlewareauth.authenticatetoken,validate.checkbookforsale,chapter.getchapternameforbook)
module.exports= router;