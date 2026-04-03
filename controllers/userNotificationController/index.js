const db = require('../../models/index');

function createUserNotification(titre, message, type, userId) {
	if (!titre || !message || !type) return false;
	const notifications = db["User_notification"];
	try {
		return notifications.create({
			message: message.toLowerCase(),
			titre: titre.toLowerCase(),
			type: type.toLowerCase(),
			utilisateurId: userId,
			read: false
		}).then((notification) => {
			if (notification) {
				return notification
			} else {
				return false
			}
		}).catch((err) => {
			return err;
		})
	} catch (e) {
		return e
	}
}

function getUserNotifications(req, res) {
	const notifications = db["User_notification"];
	notifications.findAll({
		where: {
			utilisateurId: req.user.id
		}
	})
	 .then((notifications) => {
		 if (notifications) {
			 return res.status(200).send(notifications)
		 } else {
			 return res.status(400).send("Bad request")
		 }
	 })
	 .catch(e => {
		 return res.status(500).send(`Internal server error : ${e.message}`)
	 })
}

function markNotificationAsRead (req, res) {
	const {notificationId} = req.params
	if (notificationId) {
		const notifications = db["User_notification"];
		notifications.findOne({
			where: {
				id: notificationId,
				utilisateurId: req.user.id
			}
		})
		 .then((notif) => {
			 notif.read = true
			 notif.save()
			  .then((notif) => res.status(200).send(notif))
			  .catch((err) => res.status(500).send(err))
		 })
		 .catch((err) => res.status(500).send(err))
	}
}

function deleteNotificationById(req, res) {
	const {notificationId} = req.params;
	if (!notificationId) return res.status(400).send("Bad request")
	const notifications = db["User_notification"];
	notifications.destroy({
		where: {
			id: notificationId,
			utilisateurId: req.user.id
		}
	}).then(() => {
		res.status(200).send(notificationId)
	})
}

function deleteNotificationsByUserId(req, res) {
	const {id} = req.user
	const notifications = db["User_notification"];
	notifications.destroy({
		where: {
			utilisateurId: id
		}
	})
	 .then(() => {
		 return res.status(200).send("done");
	 })
}

module.exports = {
	createUserNotification,
	getUserNotifications,
	markNotificationAsRead,
	deleteNotificationById,
	deleteNotificationsByUserId
}