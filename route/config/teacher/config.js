const express = require('express');
const router = express.Router();

// importing config controller
const configController = require('../../../controllers/config/teacher/config');

router.post('/notifications',configController.getNotifications);
router.post('/delnotifications',configController.deleteNotifications);
module.exports = router;