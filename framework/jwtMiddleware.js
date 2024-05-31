const jwt = require('jsonwebtoken')
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
            if (err || decoded === null || decoded === undefined) {
                console.log(err, decoded)
                return res.status(401).send('Unauthorized')
            } else {
                req.user = decoded
                console.log('jwt middleware',decoded)
                next()
            }
        })
    } else {
        console.log("no token")
        res.status(401).send('Unauthorized')
    }

}

module.exports = verifyToken