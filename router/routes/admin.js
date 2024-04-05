const express = require('express');
const router = express.Router();
const verifyToken = require('../../framework/jwtMiddleware')
const {
    connectAdmin,
    logoutAdmin,
    getAdmin,
    getAllEntreprise,
    getTeamByEmployerId,
    updateDriverPending,
    refreshToken
} = require('../../controllers/adminController/index')

router.post('/login', connectAdmin)
router.get('/logout', verifyToken, logoutAdmin)
router.get('/get', verifyToken, getAdmin)
router.get('/entreprise', verifyToken, getAllEntreprise)
router.get('/team/:id', verifyToken, getTeamByEmployerId)
router.post('/updateDriverPending', verifyToken, updateDriverPending)
router.post('/refreshToken', refreshToken)

module.exports = router