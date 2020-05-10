const express = require('express');
const router = express.Router();

const admin = require('./admin/admin');
const teacher = require('./teacher/teacher');

router.use('/admin', admin);
router.use('/teacher', teacher);

module.exports = router;