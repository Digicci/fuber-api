const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(function(req,res,next){
    next()
})

module.exports = app