const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require("../../../config.json");
const messages = require('../../../messages.json');

module.exports = {
	name: 'hypixelembed',
	description: `Commande pour prendre les rôles pour hypixel.`,

	execute: async (interaction, client) => {
		// Si l'utilisateur n'a pas la permission d'utiliser la commande
		if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) {
			return await interaction.reply({
				content: `${messages.permissionInsuffisante}`,
				ephemeral: true,
			});
		}

		interaction.channel.send({
			embeds: [{
				title: 'Choississez le rôles qu vous avez sur hypixel',
				description: 'VIP\nVIP+\nMVP\nMVP+\nMVP++',
				footer: { text: 'FrenchLegacy', icon_url: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png` },
			}],
			components: [
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('roles_vip')
							.setLabel('VIP')
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('roles_vip+')
							.setLabel('VIP+')
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('roles_mvp')
							.setLabel('MVP')
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('roles_mvp+')
							.setLabel('MVP+')
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('roles_mvp++')
							.setLabel('MVP++')
							.setStyle(ButtonStyle.Primary),
					)
			]
		})
	},
};