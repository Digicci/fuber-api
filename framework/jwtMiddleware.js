const jwt = require('jsonwebtoken')
const HOTKEY = 'secret'

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
        jwt.verify(token, HOTKEY, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized')
            } else {
                req.user = decoded
                next()
            }
        }, {algorithm: 'HS256'})
    } else {
        res.status(401).send('Unauthorized')
    }
}

module.exports = verifyToken