const express = require('express');
const router = express.Router();

// importing controller
const controller = require('../../../controllers/config/user/config');

router.post('/getrectacti', controller.getRectActi);
router.post('/delrectacti',controller.delRectActi);
router.post('/notifications',controller.getNotifications);
router.post('/delnotifications',controller.deleteNotifications);
module.exports = router;