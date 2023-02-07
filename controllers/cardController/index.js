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

function confirmPaiement(pm, user, amount) {
    return new Promise((resolve, reject) => {
        stripe.paymentIntents.create({
            amount: parseFloat(amount),
            currency: 'eur',
            customer: user,
            payment_method: pm,
            off_session: true,
            confirm: true,
        }).then((intent) => {
            resolve(intent)
        }).catch((err) => {
            reject(err)
        })
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
            res.status(200).send(false)
    })
}

function setDefault (req, res) {
    const id = req.user.id
    const { pm } = req.body

    db.utilisateur.findByPk(id)
        .then((user) => {
            if (user.stripe_id) {
                stripe.customers.update(
                    user.stripe_id,
                    {invoice_settings: {default_payment_method: pm}}
                ).then((respond) => {
                    res.status(200).send(true)
                }).catch((err) => {
                    res.status(200).send(false)
                })
            }
        }).catch((err) => {
            res.status(200).send(false)
    })
}

function getDefault(req, res) {
    const id = req.user.id

    db.utilisateur.findByPk(id)
        .then((user) => {
            if (user.stripe_id) {
                stripe.customers.retrieve(
                    user.stripe_id
                ).then((respond) => {
                    const pm = respond.invoice_settings.default_payment_method
                    if (pm) {
                        stripe.paymentMethods.retrieve(
                            pm
                        ).then((respond) => {
                            res.status(200).send(respond)
                        }).catch((err) => {
                            res.status(200).send(false)
                        })
                    } else {
                        res.status(200).send(false)
                    }
                }).catch((err) => {
                    res.status(200).send(false)
                })
            }
        }).catch((err) => {
            res.status(200).send(false)
    })
}

function saveIntent(req, res) {
    const user = req.user
    db.utilisateur.findByPk(user.id).then((user) => {
        if (user) {
            stripe.setupIntents.confirm(user.stripe_card_id, {
                payment_method: 'pm_card_visa',
                usage: 'off_session',
            }).then((intent) => {
                user.stripe_card_id = intent.client_secret
                user.save()
                res.status(200).send({client_secret: intent.client_secret})
            })
        }
    })
}

module.exports = {addCardIntent, confirmPaiement, getCards, saveIntent, createCustomer, setDefault, getDefault, deleteCard}