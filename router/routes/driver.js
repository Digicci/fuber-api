const express = require('express');
const router = express.Router();
const { createDriver, login, getEntreprise, logout } = require('../../controllers/driverController/index');
const verifyToken = require('../../framework/jwtMiddleware');

router.post('/signup', createDriver)
router.post('/login', login)
router.get('/get',verifyToken, getEntreprise)
router.get('/logout', verifyToken, logout)

module.exports = router