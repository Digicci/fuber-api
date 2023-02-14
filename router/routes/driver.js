const express = require('express');
const router = express.Router();
const { createDriver } = require('../../controllers/driverController/index');

router.post('/signup', createDriver)

module.exports = router