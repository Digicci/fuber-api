const express = require('express');
const router = express.Router();
const { createDriver, login } = require('../../controllers/driverController/index');

router.post('/signup', createDriver)
router.post('/login', login)

module.exports = router