const db = require("../models/index");

const raceManager = db.course;
const {entreprise, utilisateur} = db;

module.exports = {
 findRaceById: (id) => {
  return raceManager.findByPk(id, {
   include: [
    {
     model: utilisateur,
     as: "utilisateur",
    },
    {
     model: entreprise,
     as: "entreprise"
    }
   ]
  })
   .then(race => race)
 }
}