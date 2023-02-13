const express = require('express');
const router = express.Router();    // Create a router
const userRoutes = require('./routes/user');
const csrfRoutes = require('./routes/security');
const raceRoutes = require('./routes/race');
const driverRoutes = require('./routes/driver');

router.use('/user', userRoutes);
router.use('/security/csrf', csrfRoutes);
router.use('/race', raceRoutes);
router.use('/entreprise', driverRoutes);

module.exports = router