const express = require('express');
const router = express.Router();

const controller = require('../../RESTcontrollers/teacher/teacher');

router.post('/fgtbtchpswd', controller.fgtbtchpswd);

module.exports = router;