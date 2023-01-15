const db = require('../../models/index');
const jwt = require('jsonwebtoken');  // Import jwt
const HOTKEY = "secret"  // Create a secret key


function addCard(req, res) {
    const {token} = req.body
    const user = req.user

    const wallet = db['wallet'];
    wallet.create({
        cardId: token,
        createdAt: new Date(),
        updatedAt: new Date(),
        utilisateurId: user.id
    }).then((response) => {
        console.log(response)
        res.status(200).send('Card registered')
    }).catch((error) => {
        console.log(error)
        res.status(401).send('Error')
    })

}

module.exports = { addCard }