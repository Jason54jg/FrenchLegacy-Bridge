const { EmbedBuilder } = require("discord.js");
const messages = require("../../../messages.json");

module.exports = {
  name: "uptime",
  description: "Affiche la disponibilité du bot.",

  execute: async (interaction) => {
    const uptimeEmbed = new EmbedBuilder()
      .setTitle("🕐 Uptime!")
      .setDescription(
        `En ligne depuis <t:${Math.floor(
          (Date.now() - interaction.client.uptime) / 1000,
        )}:R>`,
      )
      .setFooter({
        text: `${messages.footerhelp}`,
        iconURL: `https://media.discordapp.net/attachments/1073744026454466600/1076983462403264642/icon_FL_finale.png`,
      });
    await interaction.followUp({ embeds: [uptimeEmbed] });
  },
};
