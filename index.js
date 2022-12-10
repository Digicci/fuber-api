const app = require("./App")
const http = require('http')

const port = 8000

const server = http.createServer(app)
server.listen(port,()=> console.log(`listening on port : ${port}`))

