const {confirmPaiement} = require('../cardController')
const db = require('../../models/index')

function addRace(req,res) {
    const {destination, driverPrice, commissionPrice, promo, driverId, total, pm} = req.body
    const id = req.user.id
    const validNumber = Math.random() * 9999
    db.utilisateur.findByPk(id).then((user) => {
      if (user.stripe_id && pm) {
        confirmPaiement(pm, user.stripe_id, total).then((respond) => {
          if (respond) {
              db.course.create({
                  total: total,
                  entrepriseId: driverId,
                  promoId: promo !== '' ? promo : null,
                  start: destination.start,
                  end: destination.end,
                  startLat: destination.startLat,
                  startLng: destination.startLng,
                  endLat: destination.endLat,
                  endLng: destination.endLng,
                  driverPrice: driverPrice,
                  commissionPrice: commissionPrice,
                  utilisateurId: id,
                  validNumber: validNumber,
              }).then((course) => {
                  res.status(200).send({course, respond, message: 'success'})
              }).catch((err) => {
                  res.status(200).send({message: 'adding race failed', error : err})
              })
          } else {
            res.status(200).send({message:'payment failed'})
          }
        }).catch((err) => {
          res.status(200).send({message:'payment failed', error: err})
        })
      }
    })
}

function getAllPendingByUser(req,res) {
    const userId = req.user.id
    const {entreprise, vehicule} = db
    db.course.findAll({
        where: {
            utilisateurId: userId,
            state: 'pending'
        },
        include: {
            model: entreprise,
            attributes: ['nom', 'prenom', 'num', 'mail'],
            include: {
                model: vehicule,
            }
        }
    }).then(async (races) => {
        if (races.length > 0 ){
            res.status(200).send(races)
        } else {
            res.status(200).send(false)
        }
    })
}

function getAllDoneByUser(req,res) {
    const userId = req.user.id
    const {entreprise, vehicule} = db
    db.course.findAll({
        where: {
            utilisateurId: userId,
            state: 'done'
        },
        include: {
            model: entreprise,
            attributes: ['nom', 'prenom', 'num', 'mail'],
            include: {
                model: vehicule,
            }
        }
    }).then(async (races) => {
        if (races.length > 0) {
            res.status(200).send(races)
        } else {
            res.status(200).send(false)
        }
    })
}

module.exports = {
    addRace,
    getAllPendingByUser,
    getAllDoneByUser
}