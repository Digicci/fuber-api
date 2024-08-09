'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const mysql = require("mysql2");
const db = {};
const {makeAssociations} = require('./.assiociation')



try {
  //Les lignes qui suivent créer une connection à mysql afin de créer la database si elle n'existe pas
  const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password
  })
  
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`)
  console.log("Database created or already exist")
} catch (e) {
  console.error(e, "Erreur de connexion mysql2")
  process.exit(1)
}

let sequelize;

try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    //Connexion à la db avec sequelize
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
} catch (e) {
  console.log(e, "Erreur de connexion sequelize")
  process.exit(1)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// TODO : remove before production test (only for dev)

makeAssociations(sequelize)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  db[modelName].sync({
    logging: false
  }).then(() => {
    console.log(`table ${modelName} synced`)
  }).catch((error) =>{
    console.log(error)
    console.log(`table ${modelName} not synced`);
  })
});

sequelize.sync().then()

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;