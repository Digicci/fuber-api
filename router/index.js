const express = require('express');
const router = express.Router();    // Create a router
const userRoutes = require('./routes/user');
const csrfRoutes = require('./routes/security');
const raceRoutes = require('./routes/race');
const driverRoutes = require('./routes/driver');
const adminRoutes = require('./routes/admin')

router.use('/user', userRoutes);
router.use('/security/csrf', csrfRoutes);
router.use('/race', raceRoutes);
router.use('/entreprise/', driverRoutes);
router.use('/admin/', adminRoutes);


module.exports = router