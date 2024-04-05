const express = require('express');
const cors = require('cors');
const db  = require('./models/index');
const router = require('./router/index');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const csurf = require('tiny-csrf')
const csrfSecret = "explicarioratiocumdeleniteseruis"
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.db = db

const corsOptions = {
    origin: [process.env.APP_ORIGIN || 'http://localhost:3000',"http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(session({
    secret: csrfSecret,
    key: 'user_sid',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false,
    }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.raw())
app.use(cookieParser(csrfSecret, { httpOnly: true }))

app.use(function(req,res,next){
    console.log(res.errored)
    next()
})
app.use(csurf(csrfSecret, [], [
    '/api/user/login',
    '/api/user/logout',
    '/api/user/setDefault',
    '/api/admin/refreshToken'
]))


app.use('/api', router)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Not found')
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app