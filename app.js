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


const app = express()

app.db = db

const corsOptions = {
    origin: 'http://localhost:3000',
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
    console.log(req.session, req.cookies, req.signedCookies)
    next()
})
app.use(csurf(csrfSecret))


app.use('/api', router)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app