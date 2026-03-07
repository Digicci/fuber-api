const http = require("node:http")
const querystring = require("node:querystring")
const crypto = require("node:crypto")

function sendValidationEmail({ email }) {
    const data = querystring.stringify({
        'from': "apimailernode@gmail.com",
        'to': email,
        'subject': "Validation de votre adresse mail.",
        'contentText': `<h1>Nous sommes heureux de vous accueillir.</h1><br/>Plus qu'une etape avant de pouvoir profiter pleinement de nos services.`,
        'baseUrl': `http://localhost:3000/validation/${email}`,
        'actionText': "Cliquez ici pour valider votre adresse mail"
    })
    const options = {
        hostname: "localhost",
        port: 2435,
        path: "/mail/validateEmail",
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Content-Length': Buffer.byteLength(data)
        }
    }

    return new Promise((resolve, reject) => {
        let validationCode = ""
        const postReq = http.request(options, (postRes) => {
            postRes.setEncoding("utf8")
            postRes.on("data", (chunk) => {
                validationCode += chunk
            })
            postRes.on("end", () => {
                resolve(validationCode)
            })
        })
        postReq.on("error", reject)
        postReq.write(data)
        postReq.end()
    })
}

function sendPasswordResetEmail(email, token) {
    const baseUrl = `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}&token=${token}`
    const data = querystring.stringify({
        'from': "apimailernode@gmail.com",
        'to': email,
        'subject': "Reinitialisation de votre mot de passe.",
        'html': `Cliquez sur le lien pour reinitialiser votre mot de passe. <br /> <a href="${baseUrl}">Cliquez içi</a>. <br/> Ou copiez le lien suivant : ${baseUrl}`,
    })
    const options = {
        hostname: "localhost",
        port: 2435,
        path: "/mail/send",
        method: "POST",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Content-Length': Buffer.byteLength(data)
        }
    }

    return new Promise((resolve, reject) => {
        const postReq = http.request(options, (postRes) => {
            postRes.setEncoding("utf8")
            postRes.on("data", () => {})
            postRes.on("end", () => {
                resolve(true)
            })
        })
        postReq.on("error", () => reject(false))
        postReq.write(data)
        postReq.end()
    })
}

module.exports = {
    sendValidationEmail,
    sendPasswordResetEmail
}