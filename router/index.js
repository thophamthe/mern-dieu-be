const express = require('express');
const router = express.Router();
const user = require ('./user');
const auth = require ('./authenticate');
const book= require('./book');
const chapter= require('./chapter')
const pay = require('./pay')
router.use('/user', user);
router.use('/auth', auth);
router.use('/book',book);
router.use('/chapter',chapter);
router.use('/pay',pay)
module.exports= router;