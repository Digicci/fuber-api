const jwt = require('jsonwebtoken')
const HOTKEY = 'secret'
const dotenv = require('dotenv')
dotenv.config()

const extractBearer = (req) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        return authHeader.split(' ')[1]
    }
    return null
}

const verifyToken = (req, res, next) => {

    const token = extractBearer(req)
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {algorithm: 'HS256'},(err, decoded) => {
            if (err || decoded === null) {
                res.status(401).send('Unauthorized')
            } else {
                req.user = decoded
                console.log(decoded)
                next()
            }
        })
    } else {
        res.status(401).send('Unauthorized')
    }

}

module.exports = verifyToken