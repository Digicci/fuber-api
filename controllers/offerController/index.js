const cwd = process.cwd()
const {join} = require('node:path')

const db = require(join(cwd, 'models', 'index.js'))
const res = require("express/lib/response");


function createOffer(req, res) {
    const {
      date_debut,
      date_fin,
      pourcentage,
      reduction,
      recurrence,
      code_offre,
      nom_offre,
      cummulable
    } = req.body

    console.log(req.body)
    if (
        !date_debut ||
        !date_fin ||
        (!pourcentage && !reduction) ||
        !nom_offre ||
        !recurrence
    ) {
        res.status(400).send('Bad request.')
        return
    }
    const offer = db['offre']
    offer.create({
        date_debut: date_debut,
        date_fin: date_fin,
        pourcentage: pourcentage,
        reduction: reduction,
        reccurence: recurrence,
        code_offre: code_offre,
        cummulable: cummulable === 'true',
        nom_offre: nom_offre,
        createdAt: new Date(),
        updatedAt: new Date()
    }).then((offre) => {
        if (offre) {
            res.status(201).send(true)
        } else {
            res.status(400).send(false)
        }
    }).catch((err) => {
        res.status(500).send('Bad request' + err)
    })
}

function getAllOffer(req, res) {
    const offer = db['offre']
    offer.findAll({
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt',
                'entrepriseID'
            ]
        }
    }).then((offer) => {
        if (offer) {
            res.status(200).send(offer)
        } else {
            res.status(400).send('false')
        }
    }).catch((err) => {
        res.status(500).send('Bad request' + err)
    })
}

module.exports = {
    createOffer,
    getAllOffer
}