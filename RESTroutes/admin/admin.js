const express = require('express');
const router = express.Router();

const controller = require('../../RESTcontrollers/admin/admin');
const auth = require('../../middleware/auth').auth;

//route for send link of forgot batch password to admin mail
router.post('/fgtprofpswd', auth, controller.fgtprofpswd);

module.exports = router;