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
      .setDescription(`Online since <t:${toFixed(uptime / 1000, 0)}:R>`)
      .setFooter({
        text: `/help [command] pour plus d'informations`,
        iconURL: "https://media.discordapp.net/attachments/242779914330177536/1074676859788328992/fl_orange.png",
      });

    interaction.followUp({ embeds: [uptimeEmbed] });
  },
};
