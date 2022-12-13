const app = require("./app")
const http = require('http')

const port = 8000

const server = http.createServer(app)
server.listen(port,()=> console.log(`\n\n\nlistening on port : ${port}`))

// testing db connexion and sync tables
app.db.sequelize.authenticate({logging: false}).then(() => {
    console.log('\nConnected to database.\n\n\n');
    }).catch(err => {
        console.error('\nUnable to connect to the database:\n\n\n', err);
    })

