const cwd = process.cwd()
const {join} = require('node:path')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const db = require(join(cwd, 'models', 'index.js'));


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
      const token = jwt.sign({id: admin.id, mail: admin.mail}, process.env.JWT_SECRET, {expiresIn: '1h'}, {algorithm: 'HS256'});
      admin.update({
        JWT: token
      })
      res.status(200).send({token,admin: adminToSend(admin)})
    })
  }).catch(err => res.status(500).json({message: "something went wrong"}))
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

function getAdmin(res,req){
  console.log(req.user)
  const admins = db['admin']

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



function adminToSend(admin){
  return {
    id: admin.id,
    mail: admin.mail,
    nom: admin.nom,
    prenom:admin.prenom,
    role:admin.role
  };
}



module.exports = {connectAdmin, logoutAdmin, getAdmin}