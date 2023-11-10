const { Server } = require("socket.io");
const dotenv = require('dotenv')
const initDriverSocket = require('./DriverOnlineSocket')
const initUserSocket = require('./UserSocket')


dotenv.config()
const io = new Server({
    cors: {
        origin: process.env.APP_ORIGIN || "http://localhost:3000",
    }
});

initDriverSocket(io)
initUserSocket(io)

module.exports = io