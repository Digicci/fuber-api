const express = require('express');
const router = express.Router();
const {
  connectAdmin,
  logoutAdmin
} = require('../../controllers/adminController/index')

router.post('/login', connectAdmin)
router.get('/logout', logoutAdmin)