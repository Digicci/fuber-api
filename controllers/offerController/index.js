const cwd = process.cwd()
const {join} = require('node:path')

const db = require(join(cwd, 'models', 'index.js'))


function createOffer(req, res) {
    const {
      date_debut,
      date_fin,
      pourcentage,
      reduction,
      recurrence,
      code_offre,
      nom_offre,
      cummulable,
      location
    } = req.body
    
    const newOffre = {
        date_debut,
        date_fin,
        pourcentage,
        reduction,
        reccurence: recurrence,
        code_offre,
        nom_offre,
        cummulable,
        location
    }

    if (
        !date_debut ||
        !date_fin ||
        (!pourcentage && !reduction) ||
        !nom_offre ||
        !recurrence ||
        !location
    ) {
        res.status(400).send('Bad request.')
        return
    }
    const offer = db['offre']
    offer.create({
        ...newOffre,
        cummulable: cummulable === 'true',
        createdAt: new Date(),
        updatedAt: new Date()
    }).then((offre) => {
        if (offre) {
            res.status(201).send(true)
        } else {
            res.status(500).send("Internal server error")
        }
    }).catch((err) => {
        res.status(500).send('Internal server error : ' + err)
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