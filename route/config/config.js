const express = require('express');
const router = express.Router();

const userConfig = require('./user/config');
const teacherConfig = require('./teacher/config');

const auth = require('../../middleware/auth').auth;
const batchauth = require('../../middleware/batchauth').batchauth;

router.use('/user', auth, userConfig);
router.use('/teacher', auth, batchauth, teacherConfig);

module.exports = router;