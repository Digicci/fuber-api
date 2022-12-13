'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('utilisateurs', [
      {
        nom: 'Dupont',
        prenom: 'Durant',
        mail: 'user@user.fr',
        mdp: 'testtest',
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
