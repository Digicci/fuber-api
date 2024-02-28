const cwd = process.cwd()
const {join} = require('node:path')

const db = require(join(cwd, 'models', 'index.js'))

function createOffer(req,res){
  const {date_debut,date_fin,pourcentage,code_offre,nom_offre} = req.body
  console.log(req.body)
  if(
    !date_debut ||
    !date_fin ||
    !pourcentage ||
    !nom_offre
  ) {
    res.status(400).send('Bad request.')
    return
  }
  const offer = db['offre']
  offer.create({
    date_debut: date_debut,
    date_fin: date_fin,
    pourcentage: pourcentage,
    reduction: 0,
    reccurence: 0,
    code_offre: code_offre,
    cummulable: 0,
    nom_offre: nom_offre,
    createdAt: new Date(),
    updatedAt: new Date()
  }).then((offre) => {
    if(offre){
      res.status(201).send('true')
    } else {
      res.status(400).send('false')
    }
  }).catch((err) => {
    res.status(500).send('Bad request' + err)
  })
}

module.exports = {
  createOffer
}