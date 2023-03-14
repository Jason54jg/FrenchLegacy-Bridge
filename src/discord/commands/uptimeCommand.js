const { toFixed } = require("../../contracts/helperFunctions.js");
const { EmbedBuilder } = require("discord.js");
const messages = require('../../../messages.json');

module.exports = {
    name: "uptime",
    description: "Affiche la disponibilité du bot.",

    execute: async (interaction, client) => {
        const uptimeEmbed = new EmbedBuilder()
            .setTitle("🕐 Uptime!")
            .setDescription(`En ligne depuis <t:${+ toFixed((Date.now() + client.uptime) / 1000, 0)}:R>`)
            .setFooter({
                text: `${messages.footerhelp}`,
                iconURL: `${messages.iconurl}`,
            });
        interaction.reply({ embeds: [uptimeEmbed] });
    },
};
