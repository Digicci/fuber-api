const express = require('express');
const router = express.Router();
const { createDriver, login, getEntreprise, logout, addEmployee, getTeam } = require('../../controllers/driverController/index');
const { getNumberOfRaceAccomplishedById, getNumberOfRaceAccomplished } = require('../../controllers/raceController/index');
const { getCA } = require('../../controllers/statsController/index');
const verifyToken = require('../../framework/jwtMiddleware');

router.post('/signup', createDriver)
router.post('/login', login)
router.get('/get',verifyToken, getEntreprise)
router.get('/logout', verifyToken, logout)
router.post('/register', verifyToken, addEmployee)
router.get('/team', verifyToken, getTeam)
router.get('/stats/getNumberOfRaceById/:id', verifyToken, getNumberOfRaceAccomplishedById)
router.get('/stats/getNumberOfRace', verifyToken, getNumberOfRaceAccomplished)
router.get('/stats/getCa', verifyToken, getCA)

module.exports = router