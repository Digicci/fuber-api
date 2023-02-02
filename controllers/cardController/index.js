const db = require('../../models/index');
const stripe = require("stripe")("sk_test_51MP9laGtIjyGGRoGbOoWLpkX4ypXVOrM34hqC0gUpBUTmcZcEUcB4nVEWc4SPRgYMm0AVs6kH52fwiskGYJAWuUh00GvV6vzsp")

function addCardIntent(req, res) {
    const userId = req.user.id

    db['utilisateur'].findOne({where: {id: userId}}).then((user) => {
        if (user) {
            stripe.setupIntents.create({
                customer: user.stripe_id,
                payment_method_types: ['card'],
                usage: 'off_session',
            }).then((intent) => {
                res.status(200).send({client_secret: intent.client_secret})
            })
        }
    })
}

async function createCustomer() {
    const customer = await stripe.customers.create()
    return customer.id
}

function getCards(req, res) {
    const userId = req.user.id

    db.utilisateur.findByPk(userId).then((user) => {
        if (user.stripe_id) {
            stripe.paymentMethods.list({
                customer: user.stripe_id,
                type: 'card',
            }).then((customer) => {
                console.log(customer)
                res.status(200).send(customer.data ?? [])
            })
        } else {
            res.status(200).send([])
        }
    })
}

function deleteCard(req, res) {
    const id = req.user.id
    const { pm } = req.body

    db.utilisateur.findByPk(id)
        .then((user) => {
            if (user.stripe_id) {
                stripe.paymentMethods.detach(
                    pm
                ).then((respond) => {
                    res.status(200).send(true)
                }).catch((err) => {
                    res.status(200).send(false)
                })
            }
        }).catch((err) => {
        console.log(err)
    })
}

function saveIntent(req, res) {
    const user = req.user
    db.utilisateur.findByPk(user.id).then((user) => {
        if (user) {
            stripe.setupIntents.confirm(user.stripe_card_id, {
                payment_method: 'pm_card_visa',
            }).then((intent) => {
                user.stripe_card_id = intent.client_secret
                user.save()
                res.status(200).send({client_secret: intent.client_secret})
            })
        }
    })
}

module.exports = {addCardIntent, getCards, saveIntent, createCustomer, deleteCard}