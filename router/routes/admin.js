const express = require('express');
const router = express.Router();
const verifyToken   = require('../../framework/jwtMiddleware')
const {
  connectAdmin,
  logoutAdmin
} = require('../../controllers/adminController/index')

router.post('/login', connectAdmin)
router.get('/logout', verifyToken, logoutAdmin)

module.exports = router