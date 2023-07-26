const express = require('express');
const router = express.Router();
const {
    createDriver,
    login,
    getEntreprise,
    addEmployee,
    getTeam,
    updateDriver
} = require('../../controllers/driverController/index');
const {
    getNumberOfRaceAccomplishedById,
    getNumberOfRaceAccomplished
} = require('../../controllers/raceController/index');
const {
    getCA,
    getBenefice,
    getBeneficeByPeriod,
    getCAByPeriod
} = require('../../controllers/statsController/index');
const verifyToken = require('../../framework/jwtMiddleware');

router.post('/signup', createDriver)
router.post('/login', login)
router.put('/update', verifyToken, updateDriver)
router.get('/get',verifyToken, getEntreprise)
router.post('/register', verifyToken, addEmployee)
router.get('/team', verifyToken, getTeam)
router.get('/stats/getNumberOfRaceById/:id', verifyToken, getNumberOfRaceAccomplishedById)
router.get('/stats/getNumberOfRace', verifyToken, getNumberOfRaceAccomplished)
router.get('/stats/getCa', verifyToken, getCA)
router.get('/stats/getBenefice', verifyToken, getBenefice)
router.get('/stats/getBeneficeByPeriod', verifyToken, getBeneficeByPeriod)
router.get('/stats/getCaByPeriod', verifyToken, getCAByPeriod)

module.exports = router