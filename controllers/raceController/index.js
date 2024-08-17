const {confirmPaiement, refundRace} = require('../cardController')
const db = require('../../models/index')

function addRace(req, res) {
  const {destination, driverPrice, commissionPrice, promo, driverId, total, pm} = req.body
  const id = req.user.id
  const validNumber = parseInt(`${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`)
  db["utilisateur"].findByPk(id).then((user) => {
    if (user.stripe_id && pm) {
      confirmPaiement(pm, user.stripe_id, total).then((intent) => {
        if (intent.status === "succeeded") {
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
            payment_intent: intent.id
          }).then((course) => {
            //console log
            console.log("courseDB", course)
            res.status(200).send({course, respond: intent, message: 'success'})
          }).catch((err) => {
            res.status(200).send({message: 'adding race failed', error: err})
          })
        } else {
          res.status(200).send({message: 'payment failed'})
        }
      }).catch((err) => {
        res.status(200).send({message: 'payment failed', error: err})
      })
    }
  })
}

function refundRaceByID(req, res) {
  //console log
  console.log("refund")
  const id = req.user.id
  const {raceId} = req.body
  if (!raceId) {
    return res.status(400).send("L'identifiant de la course n'a pas été transmis")
  }
  db.course.findByPk(raceId)
    .then(async (race) => {
      if (!race || race.utilisateurId !== parseInt(id)) {
        return res.status(400).send("Cette course n'existe pas")
      }
      if (race.state === "refunded") {
        throw new Error("La demande de remboursement à déjà été effectuée.")
      }
      const refund = await refundRace(race.payment_intent)
      switch (refund.status) {
        case "succeeded":
          race.update({
            state: "refunded"
          }).then(() => res.status(200).send("succeeded"))
          break
        
        default:
          throw new Error(refund)
          
      }
    })
    .catch((e) => {
      res.status(400).send(`${e.message}`)
    })
}

function getAllPendingByUser(req, res) {
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
    if (races.length > 0) {
      res.status(200).send(races)
    } else {
      res.status(200).send([])
    }
  })
}

function getAllDoneByUser(req, res) {
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

function getNumberOfRaceAccomplishedById(req, res) {
  const {id} = req.params
  db.course.count({
    where: {
      entrepriseId: id,
      state: 'done'
    }
  }).then((count) => {
    res.status(200).send({count})
  })
}

function getNumberOfRaceAccomplished(req, res) {
  const id = req.user.id
  const {entreprise} = db
  entreprise.findAll({
    where: {
      employerId: id
    }
  }).then((entreprises) => {
    const ids = entreprises.map((entreprise) => {
      return entreprise.id
    })
    ids.push(id)
    db.course.count({
      where: {
        entrepriseId: ids,
        state: 'done'
      }
    }).then((count) => {
      res.status(200).send({count})
    })
  })
}

function validatePendingRace(req,res) {
  const {raceId, validationNumber} = req.body;
  const {courses} = db;
  courses.findByPk(raceId).then(
   (course) => {
     if (validationNumber !== course.validNumber) {
       res.status(406).send("Le code de validation ne correspond pas à la course, merci de vérifier votre code et de recommencer.")
       return
     }
     course.update({
       state: "done"
     }).then(() => {
       res.status(204).send()
     })
   },
   (reason) => {
     console.log(reason)
     res.status(500).send(reason)
   }
  )
}

module.exports = {
  addRace,
  getAllPendingByUser,
  getAllDoneByUser,
  getNumberOfRaceAccomplishedById,
  getNumberOfRaceAccomplished,
  refundRaceByID,
  validatePendingRace
}