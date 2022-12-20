const express = require('express');
const cors = require('cors');
const db  = require('./models/index');
const router = require('./router/index');
const bodyParser = require('body-parser');


const app = express()

app.db = db

app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.use(function(req,res,next){
    next()
})

app.use('/api', router)

module.exports = app