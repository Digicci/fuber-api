'use strict';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('test', salt);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('utilisateurs', [
      {
        nom: 'Dupont',
        prenom: 'Durant',
        mail: 'user@user.fr',
        mdp: hash,
        num: '0646667686',
        adresse: '22 route des tests',
        ville: 'Paris',
        cp: '75000',
        pays: 'France',
        createdAt: new Date(),
        updatedAt: new  Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
