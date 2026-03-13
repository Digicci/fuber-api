const {setIsOnline, updateDriverLocation} = require('../controllers/driverController')
const {getUserSocketTokenById} = require("../controllers/userController");
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
        
        socket.on("race:refuse", (data, callback) => {
            const {utilisateurId} = data;
            const user_socket_id = getUserSocketTokenById(utilisateurId);
            
            // todo : ajouter l'appel d'une fonction permettant de changer le status de la course et de lancer le remboursement du client ou la levé de d'empreinte.
            
            io.of("/user").to(user_socket_id).emit("race:refused", data);
            
            callback("received")
        })
    })
}

module.exports = initDriverSocket