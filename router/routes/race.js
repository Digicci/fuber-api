const express = require('express');
const router = express.Router();    // Create a router
const verifyToken  = require('../../framework/jwtMiddleware');
const { addRace } = require('../../controllers/raceController/index');

router.post('/add', verifyToken, addRace)

module.exports = router