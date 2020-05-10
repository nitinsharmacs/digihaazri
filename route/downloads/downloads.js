const express = require('express');
const router = express.Router();

// importing auth and batchauth middlewares
const auth = require('../../middleware/auth').auth;
const batchauth = require('../../middleware/batchauth').batchauth;

// importing teacher downloads controller
const downloads = require('../../controllers/downloads/downloads');

router.get('/attendencehistory/:id', auth, batchauth, downloads.attendencehistory);	// route for downloading attendence history

module.exports = router;