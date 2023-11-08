const app = require("./app")
const http = require('http')
const dotenv = require('dotenv')
dotenv.config()

//WEB SERVER DEFINITION

const port = normalizePort(process.env.APP_PORT || '8000')
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
// testing db connexion and sync tables
app.db.sequelize.authenticate({logging: false}).then(() => {
    console.log('\nConnected to database.\n\n\n');
    }).catch(err => {
        console.error('\nUnable to connect to the database:\n\n\n', err);
    })

//END WEB SERVER DEFINITION

//WEB SOCKET DEFINITION

//TODO : The web socket listener will be here

//END WEB SOCKET DEFINITION

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use, please use an other port or shutdown the running instance')
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Listening on ' + bind)
}