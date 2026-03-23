const cwd = process.cwd()
const {join} = require('node:path')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {updateDriverCommission} = require("../driverController");
dotenv.config()


const db = require(join(cwd, 'models', 'index.js'));
const e = require("express");
const {where} = require("sequelize");


function connectAdmin(req,res){
  const {mail, mdp} = req.body
  if(!mail || !mdp) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  db['admin'].findOne({where: {mail}}).then((admin) => {
    if(!admin) {
      return res.status(401).json({message: "Access denied"})
    }
    bcrypt.compare(mdp, admin.mdp, (err, result) => {
      if(err) {
        return res.status(500).json({message: "something went wrong"});
      }
      if(!result) {
        return res.status(401).json({message: "Access denied"});
      }
      const payload = {id: admin.id, mail: admin.mail}
      const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 1});
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'})
      admin.update({
        JWT: token,
        secret: refreshToken
      })
      res.status(200).send({token, refreshToken, admin: adminToSend(admin)})
    })
  }).catch(err => res.status(500).json({message: "something went wrong"}))
}

function refreshToken(req,res) {

  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, {algorithm: 'HS256'},(err, decoded) => {
    if (err || decoded === null || decoded === undefined) {
      return res.status(401).send('Unauthorized')
    }
    req.user = decoded
    console.log('jwt middleware',decoded)
  })
  db["admin"].findByPk(req.user.id).then((admin) => {
    if(!admin) {
      return res.status(401).send('Unauthorized')
    }
    const token = jwt.sign({id:req.user.id, mail: req.user.mail}, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.status(200).send({token})
  })

}

function logoutAdmin(req,res){
  const admins = db['admin']
  admins.findOne({where:{
    id:req.user.id
    }
  }).then(
    (admin) => {
      if(admin){
        admin.update({
          JWT: null
        })
        res.status(200).json({message: "Logged out successfully"});
      } else {
        res.status(401).json({message: "Admin not found"});
      }
    }
  )
}

function getAdmin(req,res){
  console.log('admin controller', req.user)
  const admins = db['admin']

  if(req.user){
    admins.findOne({
      where: {
        id: req.user.id
      }
    }).then(
      (admin) => {
        if(admin){
          res.status(200).json(adminToSend(admin));
        } else {
          res.status(401).json({message: "Admin not found"});
        }
      }
    )
  }
}
function getAllEntreprise(req,res){
  const utilisateur = db['entreprise']
  if(req.user){
    utilisateur.findAll({
      where: {
        employerId: null,
      },
      attributes:{
        exclude:[
          'mdp',
          'code_recup',
          'UUID',
          'socket_token',
          'lat',
          'lng'
        ]
      }
    }).then(
      (user) => {
        if(user) {
          res.status(200).send(user)
        } else {
          res.status(400).send('Bad request.')
        }
      }
    )
  } else {
    res.status(400).send('Bad request.')
  }
}


function getTeamByEmployerId (req,res) {
  const {id} = req.params
  const entreprise = db['entreprise']
  entreprise.findAll({
    where: {
      employerId: id,
    },
    attributes:{
      exclude:[
        'mdp',
        'code_recup',
        'UUID',
        'socket_token',
        'lat',
        'lng'
      ]
    }
  }).then((team) => {
    res.status(200).send(team)
  }).catch((err)=>{
    res.status(500).send(err)
  })
}


function updateDriverPending (req,res) {
  const {id, statut} = req.body
  const entreprise = db['entreprise']
  entreprise.findByPk(id).then((entreprise) =>{
    if(entreprise){
      entreprise.update({
        statut : statut
      })
      res.status(201).send('Done')
    }else{
      res.status(401).send('Bad request')
    }
  }).catch((err) => {
    res.status(500).send(err)
  })

}

function adminToSend(admin){
  return {
    id: admin.id,
    mail: admin.mail,
    nom: admin.nom,
    prenom:admin.prenom,
    role:admin.role
  };
}

function updateEntrepriseCommission(req, res) {
  const {driverId, commission} = req.body;
  if (!driverId || !commission) return res.status(400).send("Bad request.");
  
  updateDriverCommission(driverId, commission)
   .then((res) => {
     if (res) return res.send("done");
     return res.status(401).send("Error during process")
   })
  return res.status(500).send("Server error");
}



module.exports = {
  connectAdmin,
  logoutAdmin,
  getAdmin,
  getAllEntreprise,
  getTeamByEmployerId,
  updateDriverPending,
  refreshToken,
  updateEntrepriseCommission
}