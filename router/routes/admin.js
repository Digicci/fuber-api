const express = require('express');
const router = express.Router();
const verifyToken   = require('../../framework/jwtMiddleware')
const {
  connectAdmin,
  logoutAdmin,
  getAdmin,
  getEntreprise
} = require('../../controllers/adminController/index')

router.post('/login', connectAdmin)
router.get('/logout', verifyToken, logoutAdmin)
router.get('/get', verifyToken, getAdmin)
router.get('/entreprise', verifyToken, getEntreprise)

module.exports = router