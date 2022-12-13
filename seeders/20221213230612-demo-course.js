'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('courses', [
      {
        prix: 10,
        heure_depart_estime: new Date(),
        heure_arriver_estime: new Date(),
        adresse_depart: '22 route des tests',
        adresse_arrive: '22 route des tests',
        date_course: new Date(),
        createdAt: new Date(),
        updatedAt: new  Date(),
        utilisateurId: 1,
        entrepriseId: 1
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
