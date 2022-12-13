'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('entreprises', [
      {
        nom: 'Dupont',
        prenom: 'Durant',
        nom_commercial: 'TaxiVite',
        siret: "79033286743",
        tva: 14.4,
        adresse: '22 route des tests',
        num: '0646667686',
        mail: 'taxi@vite.fr',
        mdp: 'testtest',
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
