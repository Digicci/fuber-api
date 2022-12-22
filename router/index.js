const express = require('express');
const router = express.Router();    // Create a router
const userRoutes = require('./routes/user');
const csrfRoutes = require('./routes/security');

router.use('/user', userRoutes);
router.use('/security/csrf', csrfRoutes);

module.exports = router