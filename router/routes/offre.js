const express = require('express');
const router = express.Router();
const verifyToken = require('../../framework/jwtMiddleware');
const {
  createOffer,
  getAllOffer
} = require('../../controllers/offerController/index');

router.post('/createOffer', verifyToken, createOffer)
router.get('/getOffers',verifyToken, getAllOffer)

module.exports = router