'use strict';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('test', salt);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		return await queryInterface.bulkInsert('utilisateurs', [
			{
				nom: "Utilisateur",
				prenom: 'Testeur',
				mail: 'user@test.fr',
				mdp: hash,
				role: "USER",
				createdAt: new Date(),
				updatedAt: new Date()
			}
		])
	},
	
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('utilisateurs', {
			nom: 'Utilisateur',
			prenom: 'Testeur',
			mail: "user@test.fr"
		})
	}
};