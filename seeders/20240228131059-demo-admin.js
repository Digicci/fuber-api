'use strict';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('test', salt);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('admins', [
      {
        nom: "Admin",
        prenom: 'Test',
        mail: 'test@test.fr',
        mdp: hash,
        role: "ADMIN"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', {
      nom: 'Admin',
      prenom: 'Test',
      mail: "test@test.fr"
    })
  }
};