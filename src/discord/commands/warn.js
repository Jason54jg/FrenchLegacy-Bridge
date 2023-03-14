const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");
const messages = require('../../../messages.json');

module.exports = {
	name: 'warn',
	description: `Commande pour avertir un joueur (lui fait également perdre 10 point).`,
	options: [
		{
			name: "name",
			description: "Le joueur a avertir",
			type: 6,
			required: true,
		},
	],

	execute: async (interaction, client) => {
		// Si l'utilisateur n'a pas la permission d'utiliser la commande
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.reply({
				content: `${messages.permissionInsuffisante}`,
				ephemeral: true,
			});
		}

		const name = interaction.options.getString("name").value;
		const user = await DB.getUserById(name);
		if (user == null) {
			return await interaction.reply({
				content: "Le joueur que vous avez tenté d'avertir n'a pas été trouvé",
				ephemeral: true,
			});
		}

		await DB.warnUser(name);
		interaction.channel.send({
			embeds: [{
				title: `Le joueur <@${name}> a été avertit !`,
				description: `<@${name}> a maintenant ${user.warn} avertissements`,
				footer: { text: 'FrenchLegacy', icon_url: `${messages.iconurl}` },
			}],
		})
	},
};