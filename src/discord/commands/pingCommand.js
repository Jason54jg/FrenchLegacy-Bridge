const config = require('../../../config.json')
const ms = require('ms');
const { toFixed } = require("../../contracts/helperFunctions.js");
const { EmbedBuilder } = require("discord.js");
const messages = require('../../../messages.json');

module.exports = {
  name: "ping",
  description: "Affiche la latence du bot.",

  execute: async (interaction, client) => {
        const stats = {
            title: `Affichage des statistiques pour ${interaction.guild.name}`,
            description: (
                `**Nom du bot principal**: <@${config.discord.bot.clientID}>\n**Latence du bot**: \`${client.ws.ping}\` ms\n**En ligne depuis** <t:${+ toFixed((Date.now() + client.uptime) / 1000, 0)}:R>\n**Votre tag**: ${interaction.user}\n**Votre ID** ${interaction.user.id}
                `),
            timestamp: new Date().toISOString(),
            footer: {text: `${messages.footerhelp}`, iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`},
                };
    await interaction.reply({ embeds: [stats] });
  },
};
