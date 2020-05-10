const express = require('express');

//importing nonadmin controllers
const nonadminController = require('../../controllers/nonadmin/nonadmin');
const router = express.Router();

router.get('/', nonadminController.getRedirectToLogin);

module.exports = router;