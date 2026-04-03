const {setIsOnline, updateDriverLocation} = require('../controllers/driverController')
const {getUserSocketTokenById} = require("../controllers/userController");
const {refundRace} = require("../controllers/cardController");
const db = require('../models/index');
function initDriverSocket(io) {
    const driverSocket = io.of('/driver')
    driverSocket.on('connection', (socket) => {
        console.log('driver connected', socket.id)

        let driverId

        socket.once("getOnline", (data, callback) => {
            driverId = data.driverId
            const connectionStatusPromise = setIsOnline(data.driverId, socket.id)
            Promise.resolve(connectionStatusPromise).then(
                (result) => {
                    const connectionStatus = result
                    console.log('getOnline')
                    console.log(data)
                    console.log(connectionStatus)
                    callback(connectionStatus ? 'connected' : 'disconnected')
                }
            )
        })

        socket.on('location:change', (data, callback) => {
            Promise.resolve(updateDriverLocation(driverId, data.location)).then((result) => {
                const message = result ? 'location updated' : 'location update failed'
                console.log(message)
                callback(message)
            })
        })

        socket.on('disconnect', () => {
            console.log('driver disconnected')
            setIsOnline(driverId, null)
        })

        socket.on('join', (data, callback) => {
            console.log('join')
            console.log(data)
        })
        
        //évènement émis lorsqu'un chauffeur accepte une course qui lui a été proposé par la partie user du projet
        socket.on("race:accept", (data, callback) => {
            callback('received')
        })
        
        socket.on("race:refuse", async (data, callback) => {
            const {utilisateurId, payment_intent} = data;
            const user_socket_id = await getUserSocketTokenById(utilisateurId);
            console.log(data);
            refundRace(payment_intent).then((refund) => {
                switch (refund.status) {
                    case "succeeded":
                        db.course.findByPk(data.id).then((race) => {
                            race.update({state: "refunded"})
                             .then(() => {
                                 io.of("/user").to(user_socket_id).emit("race:refused", data);
                             })
                        })
                        break;
                        
                    default:
                        return
                }
            })
            
            callback("received")
        })
    })
}

module.exports = initDriverSocket