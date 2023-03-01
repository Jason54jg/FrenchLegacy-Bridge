const config = require("../../../config.json");
const DB = require("../../../API/database/database.js");

module.exports = {
    name: 'warn',
	description: `Commande pour avertir un joueur (lui fait �galement perdre 1 point).`,
    options: [
        {
            name: "name",
            description: "Minecraft Username",
            type: 3,
            required: true,
        },
    ],

	execute: async (interaction, client) => {
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.followUp({
				content: "Vous n'�tes pas autoris� � ex�cuter cette commande.",
				ephemeral: true,
			});
		}

		const name = interaction.options.getString("name");
		const user = await DB.getUserByName(name);
		if (user == null) {
			return await interaction.followUp({
				content: "Le joueur que vous avez tent� d'avertir n'a pas �t� trouv�",
				ephemeral: true,
			});
		}

		await DB.warnUser(user.uuid);
		interaction.channel.send({
			embeds: [{
				title: `Le joueur ${user.mc_username} a �t� avertit !`,
				description: `${user.mc_username} a maintenant {user.warn} avertissements`,
				footer: { text: 'FrenchLegacy', icon_url: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png" },
			}],
		})
	},
};