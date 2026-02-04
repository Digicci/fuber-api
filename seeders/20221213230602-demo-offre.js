'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('offres', [
        {
            nom_offre: 'Offre 1',
            reduction: 10,
            createdAt: new Date(),
            updatedAt: new  Date(),
            date_debut: new Date(),
            date_fin: new Date(),
            code_offre: 'test',
            cummulable: 2,
            pourcentage: 0
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