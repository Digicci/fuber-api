const {setIsOnline, updateDriverLocation} = require('../controllers/driverController')
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
        
        //évènement émis lorsqu'un chauffeur accepte une course qui lui a été proposé par la partie driver du projet
        socket.on("race:accept", (data, callback) => {
            console.log(data)
            callback('received')
        })
    })
}

module.exports = initDriverSocket