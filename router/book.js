const express = require('express');
const router = express.Router();
const upload= require('../multer/book');
const book= require('../controller/book');
const chapter =  require('../controller/chapter') 
const middlewareauth = require('../middleware/authenticate');
const validate = require('../validate/book')

router.get('/checkUserReadbook/:idbook',middlewareauth.authenticatetoken,validate.checkreadbook,book.CheckUserRequestReadbook);
router.get('/listbook/:page',book.getlistbook);
router.get('/:idbook',middlewareauth.authenticatetoken,book.getdataonebook);
router.get('/buybook/:idbook',middlewareauth.authenticatetoken,book.buybook);
router.post('/writebook',middlewareauth.authenticatetoken,upload.single("urlimg"),book.writebook);
router.post('/updatebook/:idbook',middlewareauth.authenticatetoken,validate.checkbookforsale,upload.single("urlimg"),book.updatebook);
router.get('/readbook/:idbook',middlewareauth.authenticatetoken,validate.checkreadbook,chapter.readchapter);
router.get('/listchapter/:idbook',middlewareauth.authenticatetoken,validate.checkreadbook,book.getlistchapter)
router.get('/getNameforId/:idbook',book.getNamebookForId)
module.exports= router;