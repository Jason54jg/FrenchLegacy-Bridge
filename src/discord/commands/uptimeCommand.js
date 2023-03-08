const { toFixed } = require("../../contracts/helperFunctions.js");
// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "uptime",
    description: "Affiche la disponibilité du bot.",

    execute: async (interaction, client) => {
        const uptimeEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("🕐 Uptime!")
            .setDescription(`En ligne depuis <t:${+ toFixed((Date.now() + client.uptime) / 1000, 0)}:R>`)
            .setFooter({
                text: `/help [command] pour plus d'informations`,
                iconURL: "https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png",
            });
        interaction.reply({ embeds: [uptimeEmbed] });
    },
};
