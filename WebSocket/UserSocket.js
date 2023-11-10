const {getDriverSocketTokenById} = require('../controllers/driverController')

function initUserSocket(io) {
    const userSocket = io.of('/user')
    userSocket.on('connection', (socket) => {
        console.log('user connected', socket.id)
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })

        socket.on('race:request', (data, callback) => {
            // Todo: find a way to send this data to the driver
            // We can use the driverId to send this data to the driver
            getDriverSocketTokenById(data.raceInfo.entrepriseId).then((token) => {
                // On peut contacter le driver grace à son token de socket, cependant il faudra bien chercher à contacter le token
                // dans le namespace /driver de socket.io comme montré ci-dessous
                io.of('/driver').to(token).emit('race:request', data.raceInfo)
                callback(token)
            })

        })

    })
}

module.exports = initUserSocket