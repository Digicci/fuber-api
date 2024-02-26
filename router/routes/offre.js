const express = require('express');
const router = express.Router();
const verifyToken = require('../../framework/jwtMiddleware');
const {createOffer} = require('../../controllers/offerController/index');

router.post('/createOffer', verifyToken, createOffer)

module.exports = router