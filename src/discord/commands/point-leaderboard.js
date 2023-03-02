const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");
const util = require("../fonction_pour_bot/point-leaderboard.js")

module.exports = {
    name: 'points-leaderboard',
	description: `Commande pour afficher le leaderboard des points`,

	execute: async (interaction, client) => {
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.followUp({
				content: "Vous n'êtes pas autorisé à exécuter cette commande.",
				ephemeral: true,
			});
		}
		let lbres = await util.createPointLeaderboardPage(1);

		if (lbres == null) {
			return await interaction.followUp({
				content: "Une erreur est survenue lors de l'éxecution de la requète vers la base de donnée.",
				ephemeral: true,
			});
		}

		interaction.channel.send({ embeds: lbres[0], components: lbres[1] });
	},
};