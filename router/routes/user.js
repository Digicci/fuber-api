const express = require('express');
const router = express.Router();    // Create a router
const {
  createUser,
  connectUser,
  getUser,
  logoutUser,
  updateUser,
  requestPasswordReset,
  verifyPasswordReset
} = require('../../controllers/userController/index');
const { addCardIntent,
  getCards,
  saveIntent,
  setDefault,
  getDefault,
  deleteCard
} = require('../../controllers/cardController/index')
const {
  getUserNotifications, markNotificationAsRead, deleteNotificationById, deleteNotificationsByUserId
} = require("../../controllers/userNotificationController");

const verifyToken  = require('../../framework/jwtMiddleware');
const {getDriverByNearest} = require("../../controllers/driverController");


router.post('/login', connectUser)

router.post('/signup', createUser)

router.post('/forgotPassword', requestPasswordReset)

router.post('/reset-password', verifyPasswordReset)

router.get('/get', verifyToken, getUser)

router.get('/logout', verifyToken, logoutUser)

router.get('/addCardIntent', verifyToken, addCardIntent)

router.get('/saveCardIntent', verifyToken, saveIntent)

router.post('/card/delete', verifyToken, deleteCard)

router.get('/cards', verifyToken, getCards)

router.post('/setDefault', verifyToken, setDefault)

router.get('/getDefault', verifyToken, getDefault)

router.put('/update', verifyToken, updateUser)

router.post('/getNearDrivers', getDriverByNearest)

// Notifications routes

router.get("/notification", verifyToken, getUserNotifications);
router.put("/notification/:notificationId/markAsRead", verifyToken, markNotificationAsRead);
router.delete("/notification/:notificationId/delete", verifyToken, deleteNotificationById);
router.delete("/notification/delete", verifyToken, deleteNotificationsByUserId);

module.exports = router