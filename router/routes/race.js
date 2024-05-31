const express = require('express');
const router = express.Router();    // Create a router
const verifyToken  = require('../../framework/jwtMiddleware');
const { refundRaceByID, addRace, getAllPendingByUser, getAllDoneByUser } = require('../../controllers/raceController/index');


router.post('/add', verifyToken, addRace)
router.get('/getAllPending', verifyToken, getAllPendingByUser)
router.get('/getAllDone', verifyToken, getAllDoneByUser)
router.post("/refundRace", verifyToken, refundRaceByID)

module.exports = router