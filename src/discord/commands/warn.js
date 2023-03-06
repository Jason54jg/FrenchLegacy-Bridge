const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");

module.exports = {
    name: 'warn',
	description: `Commande pour avertir un joueur (lui fait également perdre 1 point).`,
    options: [
        {
            name: "name",
            description: "Le joueur a avertir",
            type: 6,
            required: true,
        },
    ],

	execute: async (interaction, client) => {
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.followUp({
				content: "Vous n'êtes pas autorisé à exécuter cette commande.",
				ephemeral: true,
			});
		}

		const name = interaction.options.getString("name").value;
		const user = await DB.getUserById(name);
		if (user == null) {
			return await interaction.followUp({
				content: "Le joueur que vous avez tenté d'avertir n'a pas été trouvé",
				ephemeral: true,
			});
		}

		await DB.warnUser(name);
		interaction.channel.send({
			embeds: [{
				title: `Le joueur <@${name}> a été avertit !`,
				description: `<@${name}> a maintenant ${user.warn} avertissements`,
				footer: { text: 'FrenchLegacy', icon_url: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png" },
			}],
		})
	},
};